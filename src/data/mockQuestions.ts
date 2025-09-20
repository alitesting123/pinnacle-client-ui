import { QuestionReply } from "@/types/proposal";

export interface EquipmentQuestionData {
  id: string;
  itemId: string;
  itemName: string;
  sectionName: string;
  question: string;
  replies?: QuestionReply[];
  status: 'pending' | 'answered';
  askedBy: string;
  askedAt: string;
}

export const mockQuestions: EquipmentQuestionData[] = [
  {
    id: 'q1',
    itemId: 'audio-1',
    itemName: '12" Line Array Speaker',
    sectionName: 'Audio Equipment',
    question: "Can these speakers handle outdoor conditions? We're concerned about potential rain during the event. Also, what's the maximum SPL output for a 1000-person audience?",
    status: 'answered',
    askedBy: 'Sarah Johnson',
    askedAt: '2025-09-19T14:30:00Z',
    replies: [
      {
        id: 'r1',
        message: "These speakers are rated IP65 for weather protection and can handle light rain. For heavy weather, we'll provide protective covers. For 1000 people, we'll get around 128dB SPL at optimal listening distance.",
        author: 'Shahar Zlochover',
        timestamp: '2025-09-19T15:15:00Z',
        isFromTeam: true
      },
      {
        id: 'r2',
        message: "Perfect! That gives us peace of mind. What about wind resistance? The venue can get quite breezy.",
        author: 'Sarah Johnson',
        timestamp: '2025-09-19T15:45:00Z',
        isFromTeam: false
      },
      {
        id: 'r3',
        message: "Great question! Our rigging system is rated for winds up to 35mph. We'll also have our crew monitoring conditions throughout the event and can make adjustments if needed.",
        author: 'Shahar Zlochover',
        timestamp: '2025-09-19T16:20:00Z',
        isFromTeam: true
      }
    ]
  },
  {
    id: 'q2',
    itemId: 'lighting-1',
    itemName: 'LED Par Can RGBW',
    sectionName: 'Lighting Equipment',
    question: "Are these dimmable? We need smooth transitions for our presentation segments.",
    status: 'answered',
    askedBy: 'Michael Chen',
    askedAt: '2025-09-18T16:45:00Z',
    replies: [
      {
        id: 'r4',
        message: "Yes, all LED Par Cans are fully dimmable from 0-100% and support smooth DMX fading. They're perfect for presentation transitions and can be programmed for automated lighting cues.",
        author: 'Shahar Zlochover',
        timestamp: '2025-09-18T17:15:00Z',
        isFromTeam: true
      },
      {
        id: 'r5',
        message: "Excellent! Can we pre-program different lighting scenes for each presentation segment?",
        author: 'Michael Chen',
        timestamp: '2025-09-18T18:30:00Z',
        isFromTeam: false
      },
      {
        id: 'r6',
        message: "Absolutely! We can create custom lighting scenes for each segment and even sync them with your presentation software if needed. Our lighting tech will work with you during rehearsal to get everything perfect.",
        author: 'Shahar Zlochover',
        timestamp: '2025-09-18T19:45:00Z',
        isFromTeam: true
      }
    ]
  },
  {
    id: 'q3',
    itemId: 'video-1',
    itemName: '20K Lumens Projector', 
    sectionName: 'Video & Projection',
    question: "What's the throw distance for these projectors? Our venue has specific mounting restrictions.",
    status: 'pending',
    askedBy: 'David Rodriguez',
    askedAt: '2025-09-19T10:15:00Z',
    replies: []
  },
  {
    id: 'q4',
    itemId: 'staging-3',
    itemName: 'Acrylic Podium',
    sectionName: 'Staging & Set',
    question: "Can we get these podiums with built-in microphone mounts? Also, do you have any alternatives in different materials?",
    status: 'answered',
    askedBy: 'Lisa Park',
    askedAt: '2025-09-17T13:20:00Z',
    replies: [
      {
        id: 'r7',
        message: "Absolutely! These acrylic podiums come with integrated mic mounts and cable management. We also offer wooden podiums in oak or mahogany finish, and modern metal podiums with LED accent lighting if you prefer alternatives.",
        author: 'Shahar Zlochover',
        timestamp: '2025-09-17T14:45:00Z',
        isFromTeam: true
      },
      {
        id: 'r8',
        message: "The LED accent lighting sounds interesting! Could you send me some photos of those metal podiums?",
        author: 'Lisa Park',
        timestamp: '2025-09-17T15:30:00Z',
        isFromTeam: false
      },
      {
        id: 'r9',
        message: "I'll send over our portfolio with LED podium options right after this call. They really make presentations pop, especially in dimmer lighting conditions!",
        author: 'Shahar Zlochover',
        timestamp: '2025-09-17T15:45:00Z',
        isFromTeam: true
      }
    ]
  },
  {
    id: 'q5',
    itemId: 'lighting-2',
    itemName: 'Moving Head Spot Light',
    sectionName: 'Lighting Equipment',
    question: "How many lamp options can these fixtures handle? We want to create multiple zones with different color temperatures throughout the event.",
    status: 'pending',
    askedBy: 'James Wilson',
    askedAt: '2025-09-19T09:30:00Z',
    replies: []
  },
  {
    id: 'q6',
    itemId: 'labor-1',
    itemName: 'Audio Engineer',
    sectionName: 'Labor & Services',
    question: "Will the audio engineer be available for a pre-event sound check? We have some VIP speakers who prefer to test their audio setup in advance.",
    status: 'answered',
    askedBy: 'Emma Thompson',
    askedAt: '2025-09-18T11:00:00Z',
    replies: [
      {
        id: 'r10',
        message: "Yes, our audio engineers are available for pre-event sound checks. We typically schedule these 2-3 hours before the event start time. For VIP speakers, we can arrange dedicated time slots and provide wireless mic testing to ensure everything is perfect.",
        author: 'Shahar Zlochover',
        timestamp: '2025-09-18T12:30:00Z',
        isFromTeam: true
      },
      {
        id: 'r11',
        message: "That's perfect! How long should we allocate for each VIP speaker during the sound check?",
        author: 'Emma Thompson',
        timestamp: '2025-09-18T13:15:00Z',
        isFromTeam: false
      },
      {
        id: 'r12',
        message: "We usually recommend 10-15 minutes per VIP speaker for a thorough sound check. This includes mic level adjustment, monitoring setup, and a quick walkthrough of their presentation flow.",
        author: 'Shahar Zlochover',
        timestamp: '2025-09-18T13:45:00Z',
        isFromTeam: true
      }
    ]
  }
];