import { DocumentTitle } from "./parts/title";
import { DocumentBody } from "./parts/body";

export default function Document() {
  return (
    <div className="flex max-w-[850px] flex-1 pt-20">
      <div className="flex flex-1 flex-col gap-4 overflow-scroll px-20">
        <DocumentTitle />
        <DocumentBody />
      </div>
    </div>
  );
}