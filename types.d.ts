declare module "react-quill-new" {
  import React from "react";

  export interface ReactQuillProps {
    theme?: string;
    modules?: any;
    formats?: string[];
    value?: string;
    defaultValue?: string;
    placeholder?: string;
    readOnly?: boolean;
    onChange?: (
      content: string,
      delta: any,
      source: string,
      editor: any
    ) => void;
    className?: string;
    style?: React.CSSProperties;
    tabIndex?: number;
    bounds?: string | HTMLElement;
    scrollingContainer?: string | HTMLElement;
    preserveWhitespace?: boolean;

    // 👇 Dòng quan trọng để fix lỗi của bạn
    ref?: any;
    forwardedRef?: any;
  }

  export default class ReactQuill extends React.Component<ReactQuillProps> {}
}
