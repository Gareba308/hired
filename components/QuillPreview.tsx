import React from "react";
import parse from "html-react-parser";

interface QuillPreviewProps {
  htmlContent: string;
}

const QuillPreview: React.FC<QuillPreviewProps> = ({ htmlContent }) => {
  const parsedContent = parse(htmlContent);

  return (
    <div
    >
      {parsedContent}
    </div>
  );
};

export default QuillPreview;
