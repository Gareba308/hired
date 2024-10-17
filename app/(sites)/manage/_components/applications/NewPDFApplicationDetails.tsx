" use client";

import React, { useState } from "react";
import {
  PDFViewer,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { Loader2 } from "lucide-react";
import parse from "html-react-parser";
import { Application } from "@prisma/client";

interface DocumentsRenderItems {
  application: Application;
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

const NewPDFApplicationDetails = ({
  application: document,
}: DocumentsRenderItems) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const handleOnRender = () => {
    setIsLoading(false);
  };
  return (
    <div style={{ width: "100%", height: "calc(100vh - 90px)" }}>
      {isLoading && (
        <div className="flex flex-col bg-white h-full items-center justify-center">
          <Loader2 className="shrink-0 animate-spin h-7 sm:h-10 w-7 sm:w-10 text-gray-600" />
        </div>
      )}
      <PDFViewer style={{ width: "100%", height: "100%" }}>
        <Document onRender={handleOnRender}>
          <Page size="A4" style={styles.page}>
            <View style={[styles.mainSection, { alignItems: "center" }]}>
              <Text style={styles.mainHeader}>{document.applicantName}</Text>
              <View style={{ flexDirection: "column" }}>
                {document.workerBio?.map((bio, index) => {
                  if (bio && typeof bio === "object" && !Array.isArray(bio)) {
                    const { county, citizen } = bio as {
                      county?: string;
                      citizen?: string;
                    };
                    return (
                      <View key={index} style={{ flexDirection: "row" }}>
                        {county && <Text style={styles.text}>{county}</Text>}
                        {county && citizen && (
                          <Text style={styles.text}>,</Text>
                        )}
                        {citizen && (
                          <Text style={[styles.text, { marginLeft: 4 }]}>
                            {citizen}
                          </Text>
                        )}
                      </View>
                    );
                  }
                  return null;
                })}
              </View>

              <View style={{ flexDirection: "column" }}>
                {document.workerContact?.map((contact, index) => {
                  if (
                    contact &&
                    typeof contact === "object" &&
                    !Array.isArray(contact)
                  ) {
                    const { email, phone } = contact as {
                      email?: string;
                      phone?: string;
                    };
                    return (
                      <View key={index} style={{ flexDirection: "row" }}>
                        {email && <Text style={styles.text}>{email}</Text>}
                        {email && phone && <Text style={styles.text}>,</Text>}
                        {phone && (
                          <Text style={[styles.text, { marginLeft: 4 }]}>
                            {phone}
                          </Text>
                        )}
                      </View>
                    );
                  }
                  return null;
                })}
              </View>
            </View>

            <View style={styles.mainSection}>
              <View wrap={false} minPresenceAhead={60}>
                <Text style={styles.header}>Summary</Text>
              </View>
              <View>
                {renderContent(document.about || "No about summary details")}
              </View>
            </View>

            <View style={styles.mainSection}>
              <View wrap={false} minPresenceAhead={60}>
                <Text style={styles.header}>Work Experience</Text>
              </View>
              <View>
                {document.experience?.map((work, index) => {
                  if (
                    work &&
                    typeof work === "object" &&
                    !Array.isArray(work)
                  ) {
                    const {
                      nameCompany,
                      location,
                      position,
                      employmentType,
                      startMonth,
                      startYear,
                      endMonth,
                      endYear,
                      stillWorking,
                      description,
                    } = work as {
                      nameCompany?: string;
                      location?: string;
                      position?: string;
                      employmentType?: string;
                      startMonth?: string;
                      startYear?: string;
                      endMonth?: string;
                      endYear?: string;
                      stillWorking?: boolean;
                      description?: string;
                    };
                    return (
                      <View key={index} style={styles.section}>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          {nameCompany && (
                            <Text style={styles.textBold}>{nameCompany}</Text>
                          )}
                          {location && (
                            <Text style={styles.textBold}>{location}</Text>
                          )}
                        </View>

                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          {position && (
                            <Text style={styles.textItalic}>
                              {position} - {employmentType}
                            </Text>
                          )}
                          {startMonth && startYear && (
                            <Text style={styles.textItalic}>
                              {startMonth}/{startYear} -{" "}
                              {endMonth && endYear
                                ? `${endMonth}/${endYear}`
                                : stillWorking
                                ? "Present"
                                : "-"}
                            </Text>
                          )}
                        </View>

                        <View>
                          <Text>
                            {description || "No work experience details"}
                          </Text>
                        </View>
                      </View>
                    );
                  }

                  return null;
                })}
              </View>
            </View>

            <View style={styles.mainSection}>
              <View wrap={false} minPresenceAhead={60}>
                <Text style={styles.header}>Education</Text>
              </View>
              <View>
                {document.tertiaryEducation?.map((education, index) => {
                  if (
                    education &&
                    typeof education === "object" &&
                    !Array.isArray(education)
                  ) {
                    const {
                      institution,
                      startMonth,
                      startYear,
                      endMonth,
                      endYear,
                      stillStudying,
                      programArea,
                      field,
                      grade,
                      activities,
                    } = education as {
                      institution?: string;
                      startMonth?: string;
                      startYear?: string;
                      endMonth?: string;
                      endYear?: string;
                      stillStudying?: boolean;
                      programArea?: string;
                      field?: string;
                      grade?: string;
                      activities?: string;
                    };
                    return (
                      <View key={index} style={styles.section}>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          {institution && (
                            <Text style={styles.textBold}>{institution}</Text>
                          )}
                          {startMonth && startYear && (
                            <Text style={styles.textBold}>
                              {startMonth}/{startYear} -{" "}
                              {endMonth && endYear
                                ? `${endMonth}/${endYear}`
                                : stillStudying
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
                          {programArea && (
                            <Text style={styles.textItalic}>
                              {programArea} - {field}
                            </Text>
                          )}
                          {grade && (
                            <Text style={styles.textItalic}>{grade}</Text>
                          )}
                        </View>

                        <View>
                          <Text>
                            {activities || "No detailed education description"}
                          </Text>
                        </View>
                      </View>
                    );
                  }

                  return null;
                })}
              </View>
              <View>
                {document.secondaryEducation?.length > 0 &&
                  document.tertiaryEducation?.length === 0 &&
                  document.secondaryEducation.map((secondary, index) => {
                    if (
                      secondary &&
                      typeof secondary === "object" &&
                      !Array.isArray(secondary)
                    ) {
                      const {
                        school,
                        startMonth,
                        startYear,
                        endMonth,
                        endYear,
                      } = secondary as {
                        school?: string;
                        startMonth?: string;
                        startYear?: string;
                        endMonth?: string;
                        endYear?: string;
                      };
                      return (
                        <View
                          key={index}
                          style={[
                            styles.section,
                            {
                              flexDirection: "row",
                              justifyContent: "space-between",
                            },
                          ]}
                        >
                          {school && (
                            <Text style={styles.textBold}>{school}</Text>
                          )}
                          {startMonth && startYear && (
                            <Text style={styles.textItalic}>
                              {startMonth}/{startYear} - {endMonth}/{endYear}
                            </Text>
                          )}
                        </View>
                      );
                    }
                    return null;
                  })}
              </View>
            </View>

            <View>
              {document.userSkills?.length > 0 && (
                <View style={styles.mainSection}>
                  <View wrap={false} minPresenceAhead={60}>
                    <Text style={styles.header}>Skills</Text>
                  </View>
                  <View style={styles.gridContainer}>
                    {document.userSkills.map((skillsEntry, index) => {
                      if (
                        skillsEntry &&
                        typeof skillsEntry === "object" &&
                        !Array.isArray(skillsEntry)
                      ) {
                        const { skills } = skillsEntry as { skills?: string[] };

                        return skills?.length
                          ? skills.map((skill, idx) => (
                              <View
                                key={`${index}-${idx}`}
                                style={styles.gridItem}
                              >
                                <View style={styles.listItemContainer}>
                                  <Text style={styles.bullet}>•</Text>
                                  <Text
                                    style={[
                                      styles.listItemSkills,
                                      { fontWeight: "normal" },
                                    ]}
                                  >
                                    {skill}
                                  </Text>
                                </View>
                              </View>
                            ))
                          : null;
                      }

                      return null;
                    })}
                  </View>
                </View>
              )}
            </View>

            <View>
              {document.award?.length > 0 && (
                <View style={styles.mainSection}>
                  <View wrap={false} minPresenceAhead={60}>
                    <Text style={styles.header}>Awards & Honours</Text>
                  </View>
                  {document.award.map((awardEntry, index) => {
                    if (
                      awardEntry &&
                      typeof awardEntry === "object" &&
                      !Array.isArray(awardEntry)
                    ) {
                      const { title, awardedMonth, awardedYear, description } =
                        awardEntry as {
                          title?: string;
                          awardedMonth?: string;
                          awardedYear?: string;
                          description?: string;
                        };

                      return (
                        <View key={index} style={styles.section}>
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                            }}
                          >
                            {title && (
                              <Text style={styles.textBold}>{title}</Text>
                            )}
                            {awardedMonth && awardedYear && (
                              <Text style={styles.textBold}>
                                {awardedMonth}/{awardedYear}
                              </Text>
                            )}
                          </View>
                          <View>
                            <Text>{description || "No award details"}</Text>
                          </View>
                        </View>
                      );
                    }
                    return null;
                  })}
                </View>
              )}
            </View>

            <View>
              {document.certificateLicense?.length > 0 && (
                <View style={styles.mainSection}>
                  <View wrap={false} minPresenceAhead={60}>
                    <Text style={styles.header}>Certifications</Text>
                  </View>
                  {document.certificateLicense.map((certEntry, index) => {
                    if (
                      certEntry &&
                      typeof certEntry === "object" &&
                      !Array.isArray(certEntry)
                    ) {
                      const {
                        certificateLicenseName,
                        validStartMonth,
                        validStartYear,
                        validEndMonth,
                        validEndYear,
                        description,
                      } = certEntry as {
                        certificateLicenseName?: string;
                        validStartMonth?: string;
                        validStartYear?: string;
                        validEndMonth?: string;
                        validEndYear?: string;
                        description?: string;
                      };

                      return (
                        <View key={index} style={styles.section}>
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                            }}
                          >
                            {certificateLicenseName && (
                              <Text style={styles.textBold}>
                                {certificateLicenseName}
                              </Text>
                            )}
                            {validStartMonth && validStartYear && (
                              <Text style={styles.textBold}>
                                {validStartMonth}/{validStartYear} -{" "}
                                {validEndMonth && validEndYear
                                  ? `${validEndMonth}/${validEndYear}`
                                  : "Present"}
                              </Text>
                            )}
                          </View>
                          <View>
                            <Text>
                              {description || "No certification details"}
                            </Text>
                          </View>
                        </View>
                      );
                    }
                    return null;
                  })}
                </View>
              )}
            </View>
          </Page>
        </Document>
      </PDFViewer>
    </div>
  );
};

export default NewPDFApplicationDetails;
