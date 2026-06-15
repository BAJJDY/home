import { hitokotoList } from "./hitokotoData";

export const getHitokoto = () => {
  const randomIndex = Math.floor(Math.random() * hitokotoList.length);
  return hitokotoList[randomIndex];
};
