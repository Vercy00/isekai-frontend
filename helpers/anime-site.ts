function getMalIdFromUrl(url: string) {
  const re = /myanimelist.net\/anime\/(\d+)\//
  const match = url.match(re)

  if (match) {
    return match[1]
  }

  return url
}

function geAniDBIdFromUrl(url: string) {
  const re = /anidb.net\/anime\/(\d+)/
  const match = url.match(re)

  if (match) {
    return match[1]
  }

  return url
}

export { getMalIdFromUrl, geAniDBIdFromUrl }
