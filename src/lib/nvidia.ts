export type NvidiaTask = "risk" | "embedding" | "vision";

const defaultBaseUrl = "https://integrate.api.nvidia.com/v1";

const taskDefaults: Record<NvidiaTask, { model: string; keyNames: string[]; modelNames: string[] }> = {
  risk: {
    model: "meta/llama-3.1-70b-instruct",
    keyNames: ["NVIDIA_RISK_API_KEY", "NVIDIA_API_KEY", "NVIDIA_BUILD_AUTOGEN_70", "NVIDIABuild-Autogen-70"],
    modelNames: ["NVIDIA_RISK_MODEL", "NVIDIA_MODEL"],
  },
  embedding: {
    model: "nvidia/nv-embedqa-e5-v5",
    keyNames: ["NVIDIA_EMBEDDING_API_KEY", "NVIDIA_API_KEY", "NVIDIA_BUILD_AUTOGEN_36", "NVIDIABuild-Autogen-36"],
    modelNames: ["NVIDIA_EMBEDDING_MODEL"],
  },
  vision: {
    model: "meta/llama-3.2-90b-vision-instruct",
    keyNames: ["NVIDIA_VISION_API_KEY", "NVIDIA_API_KEY", "NVIDIA_BUILD_AUTOGEN_79", "NVIDIABuild-Autogen-79"],
    modelNames: ["NVIDIA_VISION_MODEL"],
  },
};

export function getNvidiaConfig(task: NvidiaTask) {
  const defaults = taskDefaults[task];
  return {
    apiKey: firstEnv(defaults.keyNames),
    baseUrl: process.env.NVIDIA_BASE_URL || defaultBaseUrl,
    model: firstEnv(defaults.modelNames) || defaults.model,
    expectedKeys: defaults.keyNames,
  };
}

function firstEnv(names: string[]) {
  for (const name of names) {
    const value = process.env[name];
    if (value) return value;
  }
  return "";
}
