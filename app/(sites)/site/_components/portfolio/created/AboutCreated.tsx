"use client"
import { About } from "@prisma/client"
import AboutEdit from "../edits/aboutSkillsAndCV/AboutEdit"

interface AboutCreatedProps{
  about: About;
  toggleCreate: ()=> void
}

const AboutCreated = ({about, toggleCreate}: AboutCreatedProps) => {
  return (
    <>
      {about && <div>
        <dl className="border border-gray-200 rounded-lg lg:py-2 mt-5 sm:mt-8">
          <AboutEdit about={about} toggleCreate={toggleCreate}/>
        </dl>
      </div>}
    </>
  )
}

export default AboutCreated