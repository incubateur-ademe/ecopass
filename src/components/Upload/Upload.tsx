"use client";

import { Upload as UploadDSFR } from "@codegouvfr/react-dsfr/Upload";
import { useEffect, useState } from "react";
import { uploadCSV } from "../../serverFunctions/uploadCSV";

const Upload = () => {
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (file) {
      uploadCSV(file).then((scores) => {
        console.log(scores);
      });
    }
  }, [file]);

  return (
    <UploadDSFR
      hint=""
      nativeInputProps={{
        accept: ".csv",
        onChange: (event) => setFile(event.target.files?.[0] || null),
      }}
    />
  );
};

export default Upload;
