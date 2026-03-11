export const PAN_ZOOM_VIEWER_CONTENT_READY_EVENT =
	'pan-zoom-viewer:content-ready'

export type PanZoomViewerTransformTarget = HTMLElement | SVGElement

export type PanZoomViewerTargetKind = 'element' | 'svg'

export interface PanZoomViewerContentReadyDetail {
	target: PanZoomViewerTransformTarget
	kind?: PanZoomViewerTargetKind
}

export function dispatchPanZoomViewerContentReady(
	source: HTMLElement,
	detail: PanZoomViewerContentReadyDetail
): boolean {
	return source.dispatchEvent(
		new CustomEvent<PanZoomViewerContentReadyDetail>(
			PAN_ZOOM_VIEWER_CONTENT_READY_EVENT,
			{
				bubbles: true,
				composed: true,
				detail,
			}
		)
	)
}
