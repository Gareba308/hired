import { Skills } from "@prisma/client"
import SkillsEdit from "../edits/aboutSkillsAndCV/SkillsEdit";

interface SkillsCreatedProps{
  skills: Skills | null;
  toggleCreate: ()=> void
}

const SkillsCreated = ({skills, toggleCreate}: SkillsCreatedProps) => {
  return (
    <>
    {skills && <div>
      <dl className="border border-gray-200 rounded-lg lg:py-2 mt-4">
        <SkillsEdit skills={skills} toggleCreate={toggleCreate}/>
      </dl>
    </div>}
    </>
  )
}

export default SkillsCreated