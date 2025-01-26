"use client"

import CookieConsent from "react-cookie-consent"

export function CookieBanner() {
  return (
    <CookieConsent
      sameSite="Lax"
      buttonText="Rozumiem"
      expires={365}
      buttonStyle={{
        background: "",
        color: "",
        borderRadius: "",
      }}
      customButtonProps={{
        className: "bg-primary rounded-sm",
      }}
      style={{
        background: "",
      }}
      containerClasses="bg-slate-900"
    >
      Na tej stronie są używane pliki cookie. Klikając &quot;Rozumiem&quot;,
      wyrażasz zgodę na używanie plików cookie.
    </CookieConsent>
  )
}
