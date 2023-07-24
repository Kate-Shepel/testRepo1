import "./index.html";
import "./index.scss";
import PageManager from "./modules/pageManager";

try {
  PageManager.init();
} catch (error) {
  if (error instanceof Error) {
    console.log(`${error.message}`);
  } else {
    console.log("An unexpected error occurred");
  }
}
