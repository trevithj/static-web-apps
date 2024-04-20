import initializeFrame1 from "./frame1.js";
import playAnimation from "./frame2.js";
import controlAnimation3 from "./frame3.js";
import controlAnimation4 from "./frame4.js";

initializeFrame1();
playAnimation(1000);
controlAnimation3.render();
controlAnimation4.render();
controlAnimation4.run();

