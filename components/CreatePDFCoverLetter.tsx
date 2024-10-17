import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  PDFViewer,
} from "@react-pdf/renderer";
import { format } from "date-fns";
import {
  About,
  Award,
  CertificationLicense,
  Experience,
  Resume,
  SecondaryEducation,
  Skills,
  Company,
  TertiaryEducation,
  User,
  Job,
  WorkerBio,
  WorkerContact,
} from "@prisma/client";
interface DocumentsRenderItems {
  dbUser: User;
  myAbout: About | null;
  myExperiences: Experience[];
  secondaryEducation: SecondaryEducation | null;
  myAcademicQualification: TertiaryEducation[];
  workerBio: WorkerBio | null;
  myCertificates: CertificationLicense[];
  myAwards: Award[];
  contact: WorkerContact | null;
  resume: Resume | null;
  skills: Skills | null;
}
interface CoverLetterProps {
  document: DocumentsRenderItems;
  company: Company;
  whyMostQualified: string;
  job: Job;
}

const styles = StyleSheet.create({
  page: {
    padding: "5%",
    fontFamily: "Times-Roman",
    backgroundColor: "#ffffff",
    marginBottom: 2,
    width: "100%",
    maxWidth: "700px",
  },
  mainSection: {
    marginBottom: 2,
    fontFamily: "Times-Roman",
    paddingVertical: 2,
  },
  section: {
    marginBottom: 1.5,
    fontFamily: "Times-Roman",
    paddingVertical: 1.5,
  },
  mainHeader: {
    fontFamily: "Times-Bold",
    fontSize: 17,
    marginBottom: 3,
  },
  header: {
    fontSize: 14,
    fontFamily: "Times-Bold",
    borderBottom: "1 solid #555",
    marginBottom: 1.5,
    paddingBottom: 1,
  },
  boldText: {
    fontSize: 12,
    fontFamily: "Times-Bold",
    color: "#666",
    marginBottom: 3,
  },
  text: {
    fontSize: 11.5,
    fontFamily: "Times-Roman",
    color: "#000",
    marginBottom: 3,
  },
  textBold: {
    fontSize: 11,
    color: "#000",
    marginBottom: 3,
    fontFamily: "Times-Bold",
  },
  textItalic: {
    fontSize: 11,
    color: "#000",
    marginBottom: 3,
    fontFamily: "Times-BoldItalic",
  },
});

const CreatePDFCoverLetter = ({
  document,
  company,
  whyMostQualified,
  job,
}: CoverLetterProps) => {
  const { dbUser, contact } = document;
  return (
    <PDFViewer style={{ width: "100%", height: "100%" }}>
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.mainSection}>
            <View style={styles.section}>
              <Text style={styles.boldText}>{dbUser.name}</Text>
              <Text style={styles.text}>{dbUser.email}</Text>
              {contact && (
                <View>
                  {contact.postal && (
                    <Text style={styles.text}>
                      P.O Box {contact.postal}
                      {contact.zip ? `-${contact.zip}` : ""}
                    </Text>
                  )}
                  {contact.town && (
                    <Text style={styles.text}>
                      {contact.town}
                      {contact.county ? `, ${contact.county}` : ""}.
                    </Text>
                  )}
                  <Text style={styles.text}>{contact.email}</Text>
                  <Text style={styles.text}>{contact.phone}</Text>
                </View>
              )}
              <Text style={styles.text}>{format(new Date(), "PPP")}.</Text>
            </View>
            <View style={styles.section}>
              <Text style={styles.boldText}>{company.company_name}</Text>
              {company.postal && (
                <Text style={styles.text}>
                  P.O Box {company.postal}
                  {company.zip ? `-${company.zip}` : ""}
                </Text>
              )}
              {company.town && (
                <Text style={styles.text}>
                  {company.town}
                  {company.county ? `, ${company.county}` : ""}.
                </Text>
              )}
            </View>
            <View style={styles.section}>
              <Text style={styles.text}>Dear Sir/Madam,</Text>
              <Text style={[styles.textBold, { marginBottom: 5 }]}>
                RE:{" "}
                <Text style={{ textDecoration: "underline" }}>
                  {job.job_title} Application
                </Text>
              </Text>
              <Text style={styles.text}>{whyMostQualified}</Text>
            </View>
            <View style={[styles.section, { marginTop: 20 }]}>
              <Text style={styles.text}>Yours faithfully,</Text>
              <Text style={styles.text}>(Signed)</Text>
              <Text style={styles.text}>{dbUser.name}.</Text>
            </View>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default CreatePDFCoverLetter;
