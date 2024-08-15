import { WorkerContact } from "@prisma/client";
import ContactPhone from "../Edits/Contacts/ContactPhone";
import ContactSecondaryEmail from "../Edits/Contacts/ContactSecondaryEmail";
import ContactPostalAddress from "../Edits/Contacts/ContactPostalAddress ";

interface ContactFormProps {
  profiles: WorkerContact[];
}

const ContactFormProfile = ({ profiles }: ContactFormProps) => {
  return (
    <>
      {profiles.map((profile) => (
        <div key={profile.id}>
          <div className="border-b border-gray-200 pb-2">
            <h2 className="font-bold text-2xl text-gray-600">
              Contact Details
            </h2>
            <p className="text-gray-600 text-base">
              Providing accurate contact details ensures that potential
              employers can easily and directly connect with you.
            </p>
          </div>

          <>
            <dl className="divide-y divide-gray-100">
              <ContactPhone profile={profile} />
              <ContactSecondaryEmail profile={profile} />
              <ContactPostalAddress profile={profile} />
            </dl>
          </>
        </div>
      ))}
    </>
  );
};

export default ContactFormProfile;
