import {
	createEffect,
	createSignal,
	For,
	Show,
	createUniqueId,
	onMount,
	onCleanup,
} from "solid-js";
import "../styles/fancy-tabs.css";

export default function BoringTabs({
	tabs = { a: "b" },
	defaultTab,
	boring = false,
	underlined,
}: {
	tabs: Record<string, string>;
	defaultTab?: string;
	boring?: boolean;
	underlined?: boolean;
}) {
	const [activeTab, setActiveTab] = createSignal<keyof typeof tabs>(
		defaultTab || Object.keys(tabs)[0],
	);
	const [tabControlsRef, setTabControlsRef] = createSignal<
		HTMLDivElement | undefined
	>();
	const [tabsButtonsRefs, setTabsRefs] = createSignal<
		Record<string, HTMLElement | undefined>
	>({});
	const [indicator, setIndicator] = createSignal<HTMLSpanElement | undefined>();

	const tabControlsRect = () => tabControlsRef()?.getBoundingClientRect();
	const activeButtonRef = () => tabsButtonsRefs()[activeTab()];
	const id = createUniqueId();

	function updateIndicator() {
		if (!boring && indicator() && activeButtonRef() && tabControlsRect()) {
			const activeButtonRect = activeButtonRef().getBoundingClientRect();
			indicator().style.left =
				activeButtonRect.left - tabControlsRect().left + "px";
			indicator().style.width = activeButtonRect.width + "px";
		}
	}

	createEffect(updateIndicator);

	onMount(() => window.addEventListener("resize", updateIndicator));
	onCleanup(() => window.removeEventListener("resize", updateIndicator));

	return (
		<div
			class={`${boring ? "boring" : "fancy"} ${
				underlined ? "underlined" : "background"
			} tabs`}>
			<div
				class="tabs-controls"
				role="tablist"
				aria-label="Tabs"
				ref={setTabControlsRef}>
				<For each={Object.keys(tabs)}>
					{(key) => (
						<button
							id={`${id}-tab-button-${key}`}
							role="tab"
							ref={(el) =>
								setTabsRefs((oldRefs) => ({ ...oldRefs, [key]: el }))
							}
							class={activeTab() == key && "active"}
							aria-selected={activeTab() == key ? "true" : "false"}
							aria-controls={`${id}-tab-panel-${key}`}
							onClick={() => setActiveTab(key)}>
							{key}
						</button>
					)}
				</For>
				<Show when={!boring}>
					<span class="tabs-indicator" ref={setIndicator}></span>
				</Show>
			</div>

			<For each={Object.entries(tabs)}>
				{([key, value]) => (
					<div
						role="tabpanel"
						id={`${id}-tab-panel-${key}`}
						class="tabs-panel"
						style={{ display: activeTab() === key ? "block" : "none" }}>
						{value}
					</div>
				)}
			</For>
		</div>
	);
}
