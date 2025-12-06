import type { Pipe } from "@/entity/Pipe";
import { Background as BackgroundRenderer } from "@/renderers/Background";
import { Bird as BirdRenderer } from "@/renderers/Bird";
import { Ground as GroundRenderer } from "@/renderers/Ground";
import { Pipe as PipeRenderer } from "@/renderers/Pipe";
import type { RendererFactory } from "@/renderers/RendererFactory";
import { Score as ScoreRenderer } from "@/renderers/Score";

/**
 * Register all entity renderers with the factory.
 * This centralizes renderer registration in the renderers module.
 *
 * @param rendererFactory - The factory to register renderers with
 */
export function registerRenderers(rendererFactory: RendererFactory): void {
  rendererFactory.register("score", {
    create: () =>
      new ScoreRenderer(
        rendererFactory.getNumberTextures(),
        rendererFactory.getScaleCalculator(),
      ),
  });

  rendererFactory.register("bird", {
    create: () =>
      new BirdRenderer(
        rendererFactory.getBirdTextures(),
        rendererFactory.getScaleCalculator(),
      ),
  });

  rendererFactory.register("background", {
    create: () =>
      new BackgroundRenderer(
        rendererFactory.getBackgroundTexture(),
        rendererFactory.getScaleCalculator(),
      ),
  });

  rendererFactory.register("ground", {
    create: () =>
      new GroundRenderer(
        rendererFactory.getGroundTexture(),
        rendererFactory.getScaleCalculator(),
      ),
  });

  rendererFactory.register("pipe", {
    create: (entity) =>
      new PipeRenderer(
        rendererFactory.getPipeTexture(),
        rendererFactory.getScaleCalculator(),
        (entity as Pipe).isTop,
      ),
  });
}
