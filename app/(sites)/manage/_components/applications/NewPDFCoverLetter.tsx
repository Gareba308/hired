import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  PDFViewer,
} from "@react-pdf/renderer";
import { format } from "date-fns";
import { Application } from "@prisma/client";
import parse from "html-react-parser";

interface CoverLetterProps {
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
const NewPDFCoverLetter = ({ application }: CoverLetterProps) => {
  return (
    <PDFViewer style={{ width: "100%", height: "100%" }}>
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.mainSection}>
            <View style={styles.section}>
              <View style={{ flexDirection: "column", marginBottom: 10 }}>
                <Text style={styles.boldText}>{application.applicantName}</Text>
                <Text style={styles.text}>{application.userEmail},</Text>
                {application.workerContact?.map((contact, index) => {
                  const contactData = contact as {
                    postal?: string;
                    zip?: string;
                    town?: string;
                    county?: string;
                    email?: string;
                    phone?: string;
                  } | null;

                  if (contactData) {
                    const { postal, zip, town, county, email, phone } =
                      contactData;
                    return (
                      <View key={index}>
                        {postal && (
                          <Text style={styles.text}>
                            P.O Box {postal}
                            {zip ? `-${zip}` : ""}
                          </Text>
                        )}
                        {town && (
                          <Text style={styles.text}>
                            {town}
                            {county ? `, ${county}` : ""}.
                          </Text>
                        )}
                        <View style={{ flexDirection: "row" }}>
                          {typeof email === "string" && (
                            <Text style={styles.text}>{email}</Text>
                          )}
                          {email && phone && <Text style={styles.text}>,</Text>}
                          {typeof phone === "string" && (
                            <Text style={[styles.text, { marginLeft: 4 }]}>
                              {phone}
                            </Text>
                          )}
                        </View>
                      </View>
                    );
                  }
                  return null;
                })}
                <Text style={styles.text}>
                  {format(application.createdAt, "PPP")}.
                </Text>
              </View>
            </View>
            <View style={styles.section}>
              <View style={{ flexDirection: "column", marginBottom: 10 }}>
                <Text style={styles.boldText}>{application.companyName},</Text>
                {application.company?.map((company, index) => {
                  const companyData = company as {
                    postal?: string;
                    zip?: string;
                    town?: string;
                    county?: string;
                  } | null;

                  if (companyData) {
                    const { postal, zip, town, county } = companyData;
                    return (
                      <View key={index}>
                        {typeof postal === "string" && (
                          <Text style={styles.text}>
                            P.O Box {postal}
                            {zip ? `-${zip}` : ""}
                          </Text>
                        )}
                        {typeof town === "string" && (
                          <Text style={styles.text}>
                            {town}
                            {typeof county === "string" ? `, ${county}` : ""}.
                          </Text>
                        )}
                      </View>
                    );
                  }
                  return null;
                })}
              </View>
            </View>
            <View style={styles.section}>
              <Text style={styles.text}>Dear Sir/Madam,</Text>
              <Text
                style={[
                  styles.text,
                  { fontSize: 14, fontWeight: "bold", marginBottom: 5 },
                ]}
              >
                RE:{" "}
                <Text style={{ textDecoration: "underline" }}>
                  {application.jobTitle} Application
                </Text>
              </Text>
              <View>{renderContent(application.whyMostQualified)}</View>
            </View>
            <View
              style={[
                styles.section,
                { flexDirection: "column", marginTop: 10 },
              ]}
            >
              <Text style={styles.text}>Yours faithfully,</Text>
              <Text style={styles.text}>(Signed)</Text>
              <Text style={styles.text}>{application.applicantName}.</Text>
            </View>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default NewPDFCoverLetter;
