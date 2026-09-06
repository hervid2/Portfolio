import { useCallback, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import type { RefObject } from "react";

/** Matches visitors who asked the operating system to reduce motion. */
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/** Matches pointing devices that can genuinely hover, which excludes touch screens. */
const HOVER_CAPABLE_QUERY = "(hover: hover) and (pointer: fine)";

interface UseHoverPreviewVideoResult {
  videoRef: RefObject<HTMLVideoElement>;
  isPreviewMounted: boolean;
  isPreviewVisible: boolean;
  startPreview: () => void;
  stopPreview: () => void;
  markPreviewReady: () => void;
  markPreviewFailed: () => void;
}

/**
 * Restarts or pauses a preview clip without ever surfacing audio.
 *
 * Playback always rewinds before starting so a second hover replays the clip
 * from its first frame, which is the same frame the poster image shows.
 *
 * @param videoElement - Video node to drive, or null before it mounts.
 * @param shouldPlay - True to play from the start, false to freeze in place.
 * @returns Nothing.
 */
function syncPreviewPlayback(videoElement: HTMLVideoElement | null, shouldPlay: boolean): void {
  if (!videoElement) {
    return;
  }

  if (!shouldPlay) {
    videoElement.pause();
    return;
  }

  videoElement.muted = true;

  if (videoElement.readyState > 0) {
    videoElement.currentTime = 0;
  }

  // A fast pointer leave aborts the pending play promise; the poster simply stays.
  void videoElement.play().catch(() => undefined);
}

/**
 * Drives the muted looping clip that replaces a card image while hovered.
 *
 * The clip is mounted lazily on the first hover so no card downloads video on
 * page load, and it is skipped entirely on touch screens, when the visitor
 * prefers reduced motion, or when the file fails to load—in every one of those
 * cases the static poster image remains the only thing rendered.
 *
 * @param previewVideoUrl - Clip URL, or undefined when the project has none.
 * @returns Video ref, mount and visibility flags, and the preview handlers.
 */
export function useHoverPreviewVideo(previewVideoUrl?: string): UseHoverPreviewVideoResult {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPreviewMounted, setIsPreviewMounted] = useState(false);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const [isPreviewReady, setIsPreviewReady] = useState(false);
  const [hasPreviewFailed, setHasPreviewFailed] = useState(false);
  const prefersReducedMotion = useMediaQuery(REDUCED_MOTION_QUERY);
  const isHoverCapable = useMediaQuery(HOVER_CAPABLE_QUERY);

  const isPreviewEnabled =
    Boolean(previewVideoUrl) && isHoverCapable && !prefersReducedMotion && !hasPreviewFailed;

  const startPreview = useCallback((): void => {
    if (!isPreviewEnabled) {
      return;
    }

    setIsPreviewMounted(true);
    setIsPreviewPlaying(true);
  }, [isPreviewEnabled]);

  const stopPreview = useCallback((): void => setIsPreviewPlaying(false), []);
  const markPreviewReady = useCallback((): void => setIsPreviewReady(true), []);
  const markPreviewFailed = useCallback((): void => setHasPreviewFailed(true), []);

  useEffect(() => {
    syncPreviewPlayback(videoRef.current, isPreviewPlaying);
  }, [isPreviewPlaying]);

  return {
    videoRef,
    isPreviewMounted,
    isPreviewVisible: isPreviewPlaying && isPreviewReady && !hasPreviewFailed,
    startPreview,
    stopPreview,
    markPreviewReady,
    markPreviewFailed
  };
}
