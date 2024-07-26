export abstract class BaseEmbedding {
  public abstract doEmbed(input: string): Promise<Array<number>>;
}
