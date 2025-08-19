'use client'
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import Image from "next/legacy/image";

const tutorials = [
	{
		name: 'Tutorial for Event Creation',
		image: '/images/event-tutorial.png',
		description: 'Learn how to create and manage events on Zynvo.',
	},
	{
		name: 'Tutorial for Club Creation',
		image: '/images/club-tutorial.png',
		description: 'Step-by-step guide to creating your own club.',
	},
	{
		name: 'Tutorial for Sign Up',
		image: '/images/signup-tutorial.png',
		description: 'Get started by signing up and setting up your profile.',
	},
	{
		name: 'Tutorial for Club Joining',
		image: '/images/joinclub-tutorial.png',
		description: 'How to find and join clubs that match your interests.',
	},
];

const ResourcesPage = () => {
	const [openIndex, setOpenIndex] = useState<number | null>(null);

	return (
		<div className="min-h-screen bg-transparent py-10 px-4">
			<h1 className="text-3xl font-bold text-yellow-400 mb-8 text-center">
				Zynvo Tutorials & Resources
			</h1>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
				{tutorials.map((tutorial, idx) => (
					<Card
						key={tutorial.name}
						className="bg-gray-900 border-yellow-500/30 hover:border-yellow-500/60 transition-colors shadow-lg cursor-pointer"
						onClick={() => setOpenIndex(idx)}
					>
						<CardHeader>
							<CardTitle className="text-yellow-400 text-lg">
								{tutorial.name}
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex flex-col items-center">
								<img
									src={tutorial.image}
									alt={tutorial.name}
									className="w-24 h-24 object-cover rounded-lg mb-4 border border-yellow-500/30"
								/>
								<p className="text-gray-300 text-sm text-center">
									{tutorial.description}
								</p>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Modal */}
			{openIndex !== null && (
				<div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
					<div className="bg-gray-900 rounded-xl border-2 border-neutral-100 shadow-2xl max-w-lg w-full p-8 relative">
						<Button
							className="absolute top-4 right-4 text-yellow-400 hover:text-yellow-300"
							onClick={() => setOpenIndex(null)}
							aria-label="Close"
						>
							<X size={28} underlinePosition={23} />
						</Button>
						<h2 className="text-2xl font-bold text-yellow-400 mb-4 text-center">
							{tutorials[openIndex].name}
						</h2>
						<Image
							src={tutorials[openIndex].image}
							alt={tutorials[openIndex].name}
                            width={160}
                            height={160}
							className="w-40 h-40 object-cover rounded-lg mx-auto mb-6 border border-yellow-500/30"
						/>
						<p className="text-gray-200 text-base text-center mb-4">
							{tutorials[openIndex].description}
						</p>
						<div className="flex justify-center">
							<Button
								className="bg-yellow-500 hover:bg-yellow-400 text-black rounded-full px-6 py-2 font-semibold shadow"
								onClick={() => setOpenIndex(null)}
							>
								Close
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default ResourcesPage;
