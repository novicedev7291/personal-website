import React from "react"
import Layout from "../components/layout"
import ProfileContainer from "../components/profile-container"
import Seo from "../components/seo"

export default function About({ location }) {
  return (
    <Layout>
      <Seo title={"About"} />
      <div className="flex flex-col w-full pt-8 px-4 space-y-4 text-gray-600 font-semibold">
        <h1 className="font-bold text-gray-600 text-3xl">Hi,</h1>
        <p>My name is Kuldeep Yadav, living in Gurugram, India.</p>
        <p>
          Currently, I am working as Software Engineer at small startup{" "}
          <strong>Noosyn Pvt. Ltd. India</strong>. I have worked upon various
          languages, frameworks and databases in span of 7 years. I love
          learning new programming languages and building things from scratch.
        </p>
        <p>
          I have started this website to write about my experiences and things I
          have learnt so far. You can follow me on twitter and github
        </p>
        <p className="italic">Thanks</p>
      </div>
      <ProfileContainer extraClassNames={`mt-4`} />
    </Layout>
  )
}
