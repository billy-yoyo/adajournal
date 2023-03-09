import { For } from "solid-js";
import { Link } from "~/models/link";
import LinkComponent from "./link";

export default function LinkList({ title, links }: { title: string, links: Link[] }) {
    return (
        <div class="section col">
            <h3 class="fullwidth">{title}</h3>
            <div class="col fullwidth">
                <For each={links}>{(link) =>
                    <LinkComponent link={link}/>
                }</For>
            </div>
        </div>
    )
} 
