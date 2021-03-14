import React from "react"

import Header from "./header"
import Main from "./main"

const DefaultLayout = ({ children }) => (
  <>
    <div className="max-w-3xl mx-auto bg-gray-50 min-h-screen px-8">
      <Header />
      <Main>{children}</Main>
    </div>
  </>
)

export default DefaultLayout
