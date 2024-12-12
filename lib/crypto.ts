function str2ab(str: string) {
  const buf = new ArrayBuffer(str.length)
  const bufView = new Uint8Array(buf)

  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i)
  }

  return buf
}

function ab2str(buf: ArrayBuffer) {
  return String.fromCharCode.apply(null, [...new Uint8Array(buf)])
}

export async function importKey(keyData: string) {
  var key = await crypto.subtle.importKey(
    "raw",
    str2ab(keyData),
    { name: "AES-CBC", hash: "AES" },
    true,
    ["decrypt", "encrypt"]
  )
  return key
}

export async function decrypt(data: string, keyData: string) {
  var key = await importKey(keyData)
  const binary = await crypto.subtle.decrypt(
    { name: "AES-CBC", iv: new Uint8Array(16).buffer },
    key,
    str2ab(data)
  )

  return btoa(ab2str(binary))
}

export async function encrypt(data: string, keyData: string) {
  var key = await importKey(keyData)
  const binary = await crypto.subtle.encrypt(
    { name: "AES-CBC", iv: str2ab("cqGOTRIPssfMrGEU") },
    key,
    str2ab(data)
  )

  return btoa(ab2str(binary))
}
