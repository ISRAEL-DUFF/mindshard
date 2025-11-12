import JSZip from 'jszip';
import { AdapterManifest } from './types';

// Compute SHA256 hash of a file
export async function computeFileSHA256(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// Compute SHA256 hash of a Uint8Array
export async function computeBufferSHA256(buffer: Uint8Array): Promise<string> {
  const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer;
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// Compute hash of manifest object
export async function computeManifestHash(manifest: AdapterManifest): Promise<string> {
  const manifestString = JSON.stringify(manifest, Object.keys(manifest).sort());
  const encoder = new TextEncoder();
  const data = encoder.encode(manifestString);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// Validate and extract contents from zip bundle
export async function validateZipBundle(file: File): Promise<{
  isValid: boolean;
  manifest?: AdapterManifest;
  adapterFile?: Uint8Array;
  configFile?: Uint8Array;
  errors: string[];
}> {
  const errors: string[] = [];
  
  try {
    const zip = new JSZip();
    const contents = await zip.loadAsync(file);

    console.log(contents.files, contents.file('manifest.json'))
    
    // Check for required files
    const manifestFile = contents.file('manifest.json');
    const adapterFile = contents.file('adapter_model.safetensors');
    const configFile = contents.file('adapter_config.json');
    
    if (!manifestFile) {
      errors.push('Missing manifest.json');
    }
    if (!adapterFile) {
      errors.push('Missing adapter_model.safetensors');
    }
    if (!configFile) {
      errors.push('Missing adapter_config.json');
    }
    
    if (errors.length > 0) {
      return { isValid: false, errors };
    }
    
    // Extract and parse manifest
    const manifestText = await manifestFile!.async('text');
    let manifest: AdapterManifest;
    try {
      manifest = JSON.parse(manifestText);
      console.log("Manifest:", manifest)
    } catch (e) {
      errors.push('Invalid manifest.json format');
      return { isValid: false, errors };
    }
    
    // Validate manifest structure
    // const requiredFields = ['name', 'version', 'description', 'base_models', 'task', 'license', 'author'];
    const requiredFields = ['name', 'version', 'description', 'base_models', 'license', 'authors'];
    for (const field of requiredFields) {
      if (!manifest[field as keyof AdapterManifest]) {
        console.log("Field:", field, manifest[field as keyof AdapterManifest])
        errors.push(`Missing required field in manifest: ${field}`);
      }
    }
    
    if (errors.length > 0) {
      return { isValid: false, errors };
    }
    
    // Extract file contents
    const adapterBuffer = await adapterFile!.async('uint8array');
    const configBuffer = await configFile!.async('uint8array');
    
    return {
      isValid: true,
      manifest,
      adapterFile: adapterBuffer,
      configFile: configBuffer,
      errors: [],
    };
  } catch (error) {
    errors.push(`Failed to read zip file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return { isValid: false, errors };
  }
}

// Extract manifest from zip without full validation
export async function extractZipManifest(file: File): Promise<AdapterManifest | null> {
  try {
    const zip = new JSZip();
    const contents = await zip.loadAsync(file);
    const manifestFile = contents.file('manifest.json');
    
    if (!manifestFile) {
      return null;
    }
    
    const manifestText = await manifestFile.async('text');
    return JSON.parse(manifestText);
  } catch (error) {
    console.error('Failed to extract manifest:', error);
    return null;
  }
}

export function verifySignature(message: string, signature: string, publicKey: string): boolean {
  // TODO: Implement actual Ed25519 signature verification for Sui
  // This is a mock implementation
  return signature.length > 0 && publicKey.length > 0;
}

export async function encryptFile(file: File, password: string): Promise<Blob> {
  // TODO: Implement AES-GCM encryption for private adapters
  // This is a mock implementation
  return new Blob([await file.arrayBuffer()], { type: file.type });
}

export async function decryptFile(encryptedBlob: Blob, password: string): Promise<Blob> {
  // TODO: Implement AES-GCM decryption
  // This is a mock implementation
  return encryptedBlob;
}
