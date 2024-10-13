import React, { useState } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { Loader2 } from "lucide-react";
import parse from "html-react-parser";
import {
  About,
  Award,
  CertificationLicense,
  Experience,
  Language,
  Resume,
  SecondaryEducation,
  Skills,
  TertiaryEducation,
  User,
  WorkerBio,
  WorkerContact,
} from "@prisma/client";

interface DocumentsRenderItems {
  dbUser: User;
  about: About | null;
  experiences: Experience[];
  secondary: SecondaryEducation | null;
  tertiary: TertiaryEducation[];
  bio: WorkerBio | null;
  certification: CertificationLicense[];
  awards: Award[];
  languages: Language[];
  contact: WorkerContact | null;
  resume: Resume | null;
  skills: Skills | null;
}
interface PdfResumeProps {
  document: DocumentsRenderItems;
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
    color: "666",
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
  listItemSkills: {
    fontSize: 11.5,
    fontFamily: "Times-Roman",
  },
  bold: {
    fontFamily: "Times-Bold",
  },
  italic: {
    fontFamily: "Times-Italic",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    fontFamily: "Times-Roman",
    justifyContent: "space-between",
  },
  gridItem: {
    width: "48%",
    fontFamily: "Times-Roman",
    marginBottom: 2,
  },
  paragraphContainer: {
    marginBottom: 3,
    fontFamily: "Times-Roman",
  },
  paragraph: {
    fontSize: 11.5,
    fontFamily: "Times-Roman",
    color: "#000",
  },
  list: {
    marginLeft: 10,
    fontFamily: "Times-Roman",
    marginBottom: 2,
  },
  listItemContainer: {
    flexDirection: "row",
    marginBottom: 2,
  },
  bullet: {
    marginRight: 5,
    fontSize: 12,
  },
  listItem: {
    fontSize: 11.5,
    color: "#000",
    fontFamily: "Times-Roman",
    flex: 1,
  },
  headerContainer: {
    marginTop: 3,
    marginBottom: 3,
  },
  lineBreak: {
    height: 5,
  },
});

const renderContent = (htmlContent: string) => {
  let listIndex = 1;
  const parsedContent = parse(htmlContent, {
    replace: (domNode: any) => {
      if (domNode.type === "tag") {
        switch (domNode.name) {
          case "p":
            return (
              <View style={styles.paragraphContainer}>
                <Text style={styles.paragraph}>
                  {domNode.children.map((child: any) => child.data)}
                </Text>
              </View>
            );
          case "ul":
            return (
              <View style={styles.list}>
                {domNode.children
                  .filter((child: any) => child.name === "li")
                  .map((child: any, index: number) => (
                    <View key={index} style={styles.listItemContainer}>
                      <Text style={styles.bullet}>•</Text>
                      <Text style={styles.listItem}>
                        {child.children.map(
                          (grandchild: any) => grandchild.data
                        )}
                      </Text>
                    </View>
                  ))}
              </View>
            );
          case "ol":
            return (
              <View style={styles.list}>
                {domNode.children
                  .filter((child: any) => child.name === "li")
                  .map((child: any, index: number) => (
                    <View key={index} style={styles.listItemContainer}>
                      <Text style={styles.bullet}>{`${listIndex++}.`}</Text>
                      <Text style={styles.listItem}>
                        {child.children.map(
                          (grandchild: any) => grandchild.data
                        )}
                      </Text>
                    </View>
                  ))}
              </View>
            );
          case "h1":
          case "h2":
          case "h3":
          case "h4":
          case "h5":
          case "h6":
            return (
              <View style={styles.headerContainer}>
                <Text style={styles.header}>
                  {domNode.children.map((child: any) => child.data)}
                </Text>
              </View>
            );
          case "br":
            return <View style={styles.lineBreak} />;

          default:
            return null;
        }
      }
    },
  });

  return parsedContent;
};

const PdfResume = ({ document }: PdfResumeProps) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={[styles.mainSection, { alignItems: "center" }]}>
          <Text style={styles.mainHeader}>{document.dbUser.name}</Text>
          <View style={{ flexDirection: "row" }}>
            {document.contact?.county && (
              <Text style={styles.text}>{document.contact?.county}</Text>
            )}
            {document.contact?.county && document.bio?.citizen && (
              <Text style={styles.text}>,</Text>
            )}
            {document.bio?.citizen && (
              <Text style={[styles.text, { marginLeft: 4 }]}>
                {document.bio?.citizen}
              </Text>
            )}
          </View>

          <View style={{ flexDirection: "row" }}>
            {document.contact?.email && (
              <Text style={styles.text}>{document.contact?.email}</Text>
            )}
            {document.contact?.email && document.contact?.phone && (
              <Text style={styles.text}>,</Text>
            )}
            {document.contact?.phone && (
              <Text style={[styles.text, { marginLeft: 4 }]}>
                {document.contact?.phone}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.mainSection}>
          <View wrap={false} minPresenceAhead={60}>
            <Text style={styles.header}>Summary</Text>
          </View>
          <View>
            {renderContent(document.about?.about || "No about summary details")}
          </View>
        </View>

        <View style={styles.mainSection}>
          <View wrap={false} minPresenceAhead={60}>
            <Text style={styles.header}>Work Experience</Text>
          </View>
          {document.experiences.map((work) => (
            <View key={work.id} style={styles.section}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                {work.nameCompany && (
                  <Text style={styles.textBold}>{work.nameCompany}</Text>
                )}
                {work.location && (
                  <Text style={styles.textBold}>{work.location}</Text>
                )}
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                {work.position && (
                  <Text style={styles.textItalic}>
                    {work.position} - {work.employmentType}
                  </Text>
                )}
                {work.startMonth && (
                  <Text style={styles.textItalic}>
                    {work.startMonth}/{work.startYear} -{" "}
                    {work.endMonth
                      ? `${work.endMonth}/${work.endYear}`
                      : work.stillWorking
                      ? "Present"
                      : "-"}
                  </Text>
                )}
              </View>
              <View>
                {renderContent(
                  work.description || "No work experience details"
                )}
              </View>
            </View>
          ))}
        </View>

        <View style={styles.mainSection}>
          <View wrap={false} minPresenceAhead={60}>
            <Text style={styles.header}>Education</Text>
          </View>
          {document.tertiary.map((education) => (
            <View key={education.id} style={styles.section}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                {education.institution && (
                  <Text style={styles.textBold}>{education.institution}</Text>
                )}
                {education.startMonth && (
                  <Text style={styles.textBold}>
                    {education.startMonth}/{education.startYear} -{" "}
                    {education.endMonth
                      ? `${education.endMonth}/${education.endYear}`
                      : education.stillStudying
                      ? "Present"
                      : "-"}
                  </Text>
                )}
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                {education.programArea && (
                  <Text style={styles.textItalic}>
                    {education.programArea} - {education.field}
                  </Text>
                )}
                {education.grade && (
                  <Text style={styles.textItalic}>{education.grade}</Text>
                )}
              </View>
              <View>
                {renderContent(
                  education.activities || "No detailed education description"
                )}
              </View>
            </View>
          ))}
          {document.secondary && document.tertiary.length === 0 && (
            <View
              style={[
                styles.section,
                { flexDirection: "row", justifyContent: "space-between" },
              ]}
            >
              <Text style={styles.textBold}>{document.secondary.school}</Text>
              <Text style={styles.textItalic}>
                {document.secondary.startMonth}/{document.secondary.startYear} -{" "}
                {document.secondary.endMonth}/{document.secondary.endYear}
              </Text>
            </View>
          )}
        </View>

        {document.skills?.skills.length !== 0 && (
          <View style={styles.mainSection}>
            <View wrap={false} minPresenceAhead={60}>
              <Text style={styles.header}>Skills</Text>
            </View>
            <View style={styles.gridContainer}>
              {document.skills?.skills.map((skill, index) => (
                <View key={index} style={styles.gridItem}>
                  <View style={styles.listItemContainer}>
                    <Text style={styles.bullet}>•</Text>
                    <Text
                      style={[styles.listItemSkills, { fontWeight: "normal" }]}
                    >
                      {skill}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {document.awards.length !== 0 && (
          <View style={styles.mainSection}>
            <View wrap={false} minPresenceAhead={60}>
              <Text style={styles.header}>Awards & Honours</Text>
            </View>
            {document.awards.map((award) => (
              <View key={award.id} style={styles.section}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={styles.textBold}>{award.title}</Text>
                  {award.awardedYear && (
                    <Text style={styles.textBold}>
                      {award.awardedMonth}/{award.awardedYear}
                    </Text>
                  )}
                </View>
                {
                  <View>
                    {renderContent(award.description || "No award details")}
                  </View>
                }
              </View>
            ))}
          </View>
        )}

        {document.certification.length !== 0 && (
          <View style={styles.mainSection}>
            <View wrap={false} minPresenceAhead={60}>
              <Text style={styles.header}>Certifications</Text>
            </View>
            {document.certification.map((cert) => (
              <View key={cert.id} style={styles.section}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  {cert.certificateLicenseName && (
                    <Text style={styles.textBold}>
                      {cert.certificateLicenseName}
                    </Text>
                  )}
                  {cert.validStartYear && (
                    <Text style={styles.textBold}>
                      {cert.validStartMonth}/{cert.validStartYear} -{" "}
                      {cert.validEndMonth}/{cert.validEndYear}
                    </Text>
                  )}
                </View>
                <View>
                  {renderContent(
                    cert.description || "No certification details"
                  )}
                </View>
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
};

export default PdfResume;