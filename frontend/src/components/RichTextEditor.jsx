import { useRef, useMemo } from "react";
import ReactQuill from "react-quill";
import Quill from "quill";
import ImageResize from "quill-image-resize-module-react";
import ImageDropAndPaste from "quill-image-drop-and-paste";
import "react-quill/dist/quill.snow.css";

Quill.register("modules/imageResize", ImageResize);
Quill.register("modules/imageDropAndPaste", ImageDropAndPaste);

const RichTextEditor = ({ value, onChange, uploadImage }) => {
  const quillRef = useRef(null);

  const insertImage = (url) => {
    const editor = quillRef.current.getEditor();
    const range = editor.getSelection(true);
    editor.insertEmbed(range.index, "image", url);
    editor.setSelection(range.index + 1);
  };

  const imageHandler = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;
      const url = await uploadImage(file);
      insertImage(url);
    };
  };

  const imageDropPasteHandler = async (imageDataUrl, type, imageData) => {
    let file;

    if (imageData?.toFile) {
      file = imageData.toFile();
    } else if (imageData?.blob) {
      file = new File([imageData.blob], "pasted.png", {
        type: imageData.blob.type || "image/png",
      });
    } else {
      const res = await fetch(imageDataUrl);
      const blob = await res.blob();
      file = new File([blob], "pasted.png", { type: blob.type });
    }

    const url = await uploadImage(file);
    insertImage(url);
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ indent: "-1" }, { indent: "+1" }],
          [{ align: [] }],
          ["link", "image", "code-block"],
          ["clean"],
        ],
        handlers: { image: imageHandler },
      },
      imageResize: {
        parchment: Quill.import("parchment"),
        modules: ["Resize", "DisplaySize"],
      },
      imageDropAndPaste: {
        handler: imageDropPasteHandler,
      },
    }),
    [],
  );

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "indent",
    "align",
    "link",
    "image",
    "code-block",
  ];

  return (
    <ReactQuill
      ref={quillRef}
      value={value}
      onChange={onChange}
      modules={modules}
      formats={formats}
    />
  );
};

export default RichTextEditor;
