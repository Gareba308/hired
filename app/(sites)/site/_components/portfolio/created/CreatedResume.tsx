import { Resume } from "@prisma/client"
import ResumeEdit from "../edits/aboutSkillsAndCV/ResumeEdit"

interface CreatedResumeProps{
    resume: Resume;
    toggleCreate: ()=> void
}

const CreatedResume = ({resume, toggleCreate} : CreatedResumeProps) => {
  return (
    <div>
        <dl className="border border-gray-200 rounded-lg lg:py-2 mt-5 sm:mt-8">
            <ResumeEdit resume={resume} toggleCreate={toggleCreate}/>
        </dl>
    </div>
  )
}

export default CreatedResume