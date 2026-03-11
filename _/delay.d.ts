

export type Options =
{
	unref?: boolean,
}


export default function delay (ms?: number, options?: Options): Promise<void>
