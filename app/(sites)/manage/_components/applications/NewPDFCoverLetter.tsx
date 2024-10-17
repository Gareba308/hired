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
});

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
              <Text style={styles.text}>{application.whyMostQualified}</Text>
            </View>
            <View
              style={[
                styles.section,
                { flexDirection: "column", marginTop: 20 },
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
