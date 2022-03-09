// next.config.js で development 時のみ読み込むようにしているので，dependencies に入れなくても問題ない
// eslint-disable-next-line import/no-extraneous-dependencies
import whyDidYouRender from "@welldone-software/why-did-you-render";
import React from "react";

whyDidYouRender(React);
// eslint-disable-next-line no-console
console.log("start why-did-you-render");
