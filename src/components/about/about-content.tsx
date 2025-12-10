"use client";

import React, { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const EnglishText = `
-*Namo Vṛkṣebhayaḥ*- is a tree plantation drive initiated by *Geet Sangeet Sagar Trust* under the auspicious and inspiring guidance of *Pūjya Goswami Śrī Prashant Kumarji Mahārāja*, and *Pūjya Goswami Śrī Poornanandji* (Bṛhan Mandir-Mumbai).

*Geet Sangeet Sagar Trust* is conducting the *Vṛkṣāropaṇa Mahotsava* on the 19th-22nd March 2026 near Govind Kund. Pūjya Mahārājaśrī has envisioned the planting of 108 trees, each corresponding to one of the 108 divine names of Śrī Gusāīṅjī. This tree plantation drive forms a part of the *CLEAN TARHETI GREEN TARHETI* Mission.

You are heartily invited to participate in this divine initiative. Feel blessed not only by planting a tree with your own hands, but also by adopting it and nurturing its growth.
`;

const HindiText = `
-*नमो वृक्षेभ्यः*- एक वृक्षारोपण अभियान है, जो *गीत सङ्गीत सागर ट्रस्ट* द्वारा *पूज्य गोस्वामी श्रीप्रशान्त कुमारजी महाराज* और *पूज्य गोस्वामी श्रीपूर्णानन्दजी* (बृहन्मन्दिर-मुम्बई) के शुभ एवं प्रेरणादायी मार्गदर्शन में प्रारम्भ किया गया है।

*गीत सङ्गीत सागर ट्रस्ट*, गोविन्द कुण्ड के निकट १९-२२ मार्च २०२६ को *वृक्षारोपण महोत्सव* का आयोजन कर रहा है। पूज्य महाराजश्री ने १०८ वृक्ष रोपने की योजना की है, जिसमें प्रत्येक वृक्ष का नाम श्रीगुसाईंगजी के १०८ दिव्य नामों के अनुरूप होगा। यह वृक्षारोपण अभियान *क्लीन तरहेटी ग्रीन तरहेटी* मिशन के अन्तर्गत है।

आपको इस दिव्य अभियान में भाग लेने हेतु हृदय से आमन्त्रित किया जाता है। न केवल अपने हाथों से वृक्ष रोपकर, अपितु उसे बढ़ते हुए देखने के लिए गोद लेकर, स्वयं को धन्य मानें।
`;

const formatText = (text: string) => {
    // Split into paragraphs first
    return text.trim().split('\n\n').map((paragraph, pIndex) => {
        // Replace -*...*- with bold italic using a placeholder to avoid conflicts
        let formatted = paragraph.replace(/-\*(.*?)\*-/g, '___BI___$1___END___');
        // Replace *...* with bold
        formatted = formatted.replace(/\*(.*?)\*/g, '___B___$1___END___');
        // Replace -...- with italic
        formatted = formatted.replace(/-(.*?)-/g, '___I___$1___END___');

        // Split by the markers to create React elements
        const parts = formatted.split(/(___B___|___I___|___BI___|___END___)/g);

        const children = [];
        let currentStyle = 'normal';

        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            if (part === '___BI___') currentStyle = 'bi';
            else if (part === '___B___') currentStyle = 'b';
            else if (part === '___I___') currentStyle = 'i';
            else if (part === '___END___') currentStyle = 'normal';
            else if (part.trim() !== '' || part === ' ') {
                if (currentStyle === 'bi') children.push(<span key={i} className="font-bold italic">{part}</span>);
                else if (currentStyle === 'b') children.push(<span key={i} className="font-bold">{part}</span>);
                else if (currentStyle === 'i') children.push(<span key={i} className="italic">{part}</span>);
                else children.push(<span key={i}>{part}</span>);
            }
            else if (part.trim() === '' && part.length > 0) children.push(<span key={i}>{part}</span>); // Preserve spaces
        }

        return <p key={pIndex} className="mb-6 leading-relaxed text-lg text-justify">{children}</p>;
    });
};

export function AboutContent() {
    const [isHindi, setIsHindi] = useState(false);

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white/50 backdrop-blur-sm rounded-2xl shadow-sm border border-primary/10">
            <div className="flex items-center justify-end mb-6 space-x-2">
                <Label htmlFor="language-mode" className={`cursor-pointer ${!isHindi ? 'font-bold text-primary' : 'text-gray-500'}`}>English</Label>
                <Switch
                    id="language-mode"
                    checked={isHindi}
                    onCheckedChange={setIsHindi}
                    className="data-[state=checked]:bg-primary"
                />
                <Label htmlFor="language-mode" className={`cursor-pointer ${isHindi ? 'font-bold text-primary' : 'text-gray-500'}`}>हिंदी</Label>
            </div>

            <div className="font-body text-foreground/90">
                {formatText(isHindi ? HindiText : EnglishText)}
            </div>
        </div>
    );
}
