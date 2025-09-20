import { EquipmentQuestionData } from "@/components/EquipmentQuestion";

export const mockQuestions: EquipmentQuestionData[] = [
  {
    id: 'q1',
    itemId: 'audio-1',
    itemName: '12" Line Array Speaker',
    sectionName: 'Audio Equipment',
    question: "Can these speakers handle outdoor conditions? We're concerned about potential rain during the event. Also, what's the maximum SPL output for a 1000-person audience?",
    status: 'pending',
    askedBy: 'Sarah Johnson',
    askedAt: '2025-09-19T14:30:00Z'
  },
  {
    id: 'q2',
    itemId: 'lighting-1',
    itemName: 'LED Par Can RGBW',
    sectionName: 'Lighting Equipment',
    question: "Are these dimmable? We need smooth transitions for our presentation segments.",
    answer: "Yes, all LED Par Cans are fully dimmable from 0-100% and support smooth DMX fading. They're perfect for presentation transitions and can be programmed for automated lighting cues.",
    status: 'answered',
    askedBy: 'Michael Chen',
    askedAt: '2025-09-18T16:45:00Z',
    answeredBy: 'Shahar Zlochover',
    answeredAt: '2025-09-18T17:15:00Z'
  },
  {
    id: 'q3',
    itemId: 'video-1',
    itemName: '20K Lumens Projector', 
    sectionName: 'Video & Projection',
    question: "What's the throw distance for these projectors? Our venue has specific mounting restrictions.",
    status: 'pending',
    askedBy: 'David Rodriguez',
    askedAt: '2025-09-19T10:15:00Z'
  },
  {
    id: 'q4',
    itemId: 'staging-3',
    itemName: 'Acrylic Podium',
    sectionName: 'Staging & Set',
    question: "Can we get these podiums with built-in microphone mounts? Also, do you have any alternatives in different materials?",
    answer: "Absolutely! These acrylic podiums come with integrated mic mounts and cable management. We also offer wooden podiums in oak or mahogany finish, and modern metal podiums with LED accent lighting if you prefer alternatives.",
    status: 'answered',
    askedBy: 'Lisa Park',
    askedAt: '2025-09-17T13:20:00Z',
    answeredBy: 'Shahar Zlochover',
    answeredAt: '2025-09-17T14:45:00Z'
  },
  {
    id: 'q5',
    itemId: 'lighting-2',
    itemName: 'Moving Head Spot Light',
    sectionName: 'Lighting Equipment',
    question: "How many lamp options can these fixtures handle? We want to create multiple zones with different color temperatures throughout the event.",
    status: 'pending',
    askedBy: 'James Wilson',
    askedAt: '2025-09-19T09:30:00Z'
  },
  {
    id: 'q6',
    itemId: 'labor-1',
    itemName: 'Audio Engineer',
    sectionName: 'Labor & Services',
    question: "Will the audio engineer be available for a pre-event sound check? We have some VIP speakers who prefer to test their audio setup in advance.",
    answer: "Yes, our audio engineers are available for pre-event sound checks. We typically schedule these 2-3 hours before the event start time. For VIP speakers, we can arrange dedicated time slots and provide wireless mic testing to ensure everything is perfect.",
    status: 'answered',
    askedBy: 'Emma Thompson',
    askedAt: '2025-09-18T11:00:00Z',
    answeredBy: 'Shahar Zlochover',
    answeredAt: '2025-09-18T12:30:00Z'
  }
];