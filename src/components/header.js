import React from "react"
import { Link } from "gatsby"

const Header = ({ location }) => (
  <header className="w-full">
    <div className="flex items-center justify-between py-4">
      <div class="text-gray-700 font-extrabold text-3xl">
        <Link to="/">coding-saga</Link>
      </div>
      <div class="text-gray-500 font-semibold text-lg">
        <Link to="/about">About</Link>
      </div>
    </div>
  </header>
)

export default Header
