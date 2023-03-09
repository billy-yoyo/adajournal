import { Show } from "solid-js";
import { Link } from "~/models/link";

export default function LinkComponent({ link } : { link: Link }) {
    return (
        <a class="link" href={link.href}>
            <h4>{link.title}</h4>
            <p class="date">{link.subtitle}</p>
            <Show when={link.text}>
                <p>{link.text}</p>
            </Show>
        </a>
    )
}

