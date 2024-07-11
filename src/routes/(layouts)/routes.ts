export type Route = {
	title: string;
	label: string;
	icon: string;
	variant: 'default' | 'ghost';
};

export const primaryRoutes: Route[] = [
	{
		title: 'Inbox',
		label: '128',
		icon: 'material-symbols:123-sharp',
		variant: 'default'
	},
	{
		title: 'Drafts',
		label: '9',
		icon: 'material-symbols:123-sharp',
		variant: 'ghost'
	},
	{
		title: 'Sent',
		label: '',
		icon: 'material-symbols:123-sharp',
		variant: 'ghost'
	},
	{
		title: 'Junk',
		label: '23',
		icon: 'material-symbols:123-sharp',
		variant: 'ghost'
	},
	{
		title: 'Trash',
		label: '',
		icon: 'material-symbols:123-sharp',
		variant: 'ghost'
	},
	{
		title: 'Archive',
		label: '',
		icon: 'material-symbols:123-sharp',
		variant: 'ghost'
	}
];
