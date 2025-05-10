import * as use from '@tensorflow-models/universal-sentence-encoder';
import * as tf from '@tensorflow/tfjs';
import { CardDefinitions } from '../CardDefinitions';

let cachedCardEmbeddings: tf.Tensor2D | null = null;
const getCardEmbeddings = async (): Promise<tf.Tensor2D> => {
  if (cachedCardEmbeddings) {
    return cachedCardEmbeddings;
  }

  const model = await use.load();
  const embeddings = await model.embed(CardDefinitions.map(c => `${c.name}: ${c.definition}`));
  cachedCardEmbeddings = tf.tensor2d(embeddings.arraySync());
  return cachedCardEmbeddings;
}

const main = async () => {
  const model = await use.load();

  // Your input
  const userInput = "I have a hackathon this week at work, I was super excited and created my own project. I opted not to work with anybody. However, I didn't finish my project, the proof of concept failed, I didn't win an award and nobody liked my project.";

  // Cosine similarity
  const inputEmbedding = await model.embed([userInput]);
  const cardEmbeddings = await getCardEmbeddings();

  const scores = (tf.matMul(
    tf.tensor2d(inputEmbedding.arraySync()),
    cardEmbeddings,
    false,
    true
  ).arraySync() as number[][])[0];

  // Rank top results
  const sorted = CardDefinitions
    .map((card, idx) => ({ ...card, score: scores[idx] }))
    .filter(card => card.score > 0.3)
    .sort((cardA, cardB) => cardB.score - cardA.score);

  console.log(sorted.slice(0, 5));
};

describe('llm', () => {
  it('should work', async () => {
    console.time('First run');
    await main();
    console.timeEnd('First run');

    console.time('Second run');
    await main();
    console.timeEnd('Second run');
  }, 120_000);
});
