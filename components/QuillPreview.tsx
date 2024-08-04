import React from "react";
import parse from "html-react-parser";

interface QuillPreviewProps {
  htmlContent: string;
}

const QuillPreview: React.FC<QuillPreviewProps> = ({ htmlContent }) => {
  const parsedContent = parse(htmlContent);

  return (
    <div
      style={{
        fontSize: "0.88rem !important",
        lineHeight: "1.35rem !important",
        color: "#334155 !important"
      }}
    >
      {parsedContent}
    </div>
  );
};

export default QuillPreview;
