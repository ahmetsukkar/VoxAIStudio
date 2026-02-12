import io
import os
import sys 
from typing import Optional
import uuid

import modal
from pydantic import BaseModel

import torch
import torchaudio

app = modal.App("vox-ai-studio")

image = (
    modal.Image.debian_slim(python_version="3.11")
    .pip_install("numpy==1.26.0", "torch==2.6.0")
    .pip_install_from_requirements("requirements.txt")
    .apt_install("ffmpeg")
)

volume = modal.Volume.from_name("hf_cache_vox-ai_studio", create_if_missing=True)
s3_secret = modal.Secret.from_name("vox-ai-studio-aws-secret")

class TextToSpeechRequests(BaseModel):
    text: str
    voice_s3_key: Optional[str] = None
    language: str = "en"
    exaggeration: float = 0.5
    cfg_weight: float = 0.5

class TextToSpeechResponse(BaseModel):
    s3_Key: str


@app.cls(
    image=image,
    gpu="L40S",
    volumes={
        "/root/.cache/huppingface": volume,
        "/s3-mount": modal.CloudBucketMount(
            "vox-ai-studio",
            secret=s3_secret
        ),
    },
    scaledown_window=120,
    secrets=[s3_secret], 
)

class ChatterboxTTSServer:
    @modal.enter()
    def load_modal(self):
        from chatterbox.mtl_tts import ChatterboxMultilingualTTS
        self.model = ChatterboxMultilingualTTS.from_pretrained(device="cuda")

    @modal.fastapi_endpoint(method="POST", requires_proxy_auth=True)
    def generate_speech(self, request: TextToSpeechRequests) -> TextToSpeechResponse:
        with torch.no_grad():
            if request.voice_s3_key:
                audio_prompt_path = f"/s3-mount/{request.voice_s3_key}"

                if not os.path.exists(audio_prompt_path):
                    raise FileNotFoundError(f"Prompt audio not found at {audio_prompt_path}")

                wav = self.model.generate(
                    request.text,
                    audio_prompt_path=audio_prompt_path,
                    language_id=request.language,
                    exaggeration=request.exaggeration,
                    cfg_weight=request.cfg_weight,
                )
            else:
                wav = self.model.generate(
                    request.text,
                    language_id=request.language,
                    exaggeration=request.exaggeration,
                    cfg_weight=request.cfg_weight,
                )

            wav_cpu = wav.cpu()

        buffer = io.BytesIO()
        torchaudio.save(buffer, wav_cpu, self.model.sr, format="wav")
        buffer.seek(0)
        audio_bytes = buffer.read()

        audio_uuid = str(uuid.uuid4())
        s3_key = f"tts/{audio_uuid}.wav"

        s3_path = f"/s3-mount/{s3_key}"
        os.makedirs(os.path.dirname(s3_path), exist_ok=True)
        with open(s3_path, "wb") as f:
            f.write(audio_bytes)
        print(f"Saved audio to S3: {s3_key}")
        return TextToSpeechResponse(s3_Key=s3_key)
