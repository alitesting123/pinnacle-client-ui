import React, { useState } from 'react';
import { FileText, ChevronDown, ChevronRight, AlertCircle, Scale, CheckCircle, Users, Package, Shield, CreditCard, XCircle, Wifi, Building2, Cloud, Edit, DollarSign } from 'lucide-react';

const TermsConditionsCard = () => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const isExpanded = (sectionId: string) => expandedSections.has(sectionId);

  const termsData = [
    {
      id: 'acceptance',
      title: 'Acceptance',
      icon: CheckCircle,
      content: [
        'Client must review, sign and return these Terms prior to Pinnacle Live providing any Equipment, Labor or Services.',
        'Adjustments to the Scope of Work may be made prior to delivery of the Equipment and/or Services, provided that any necessary labor and equipment are available to accommodate your request.',
      ]
    },
    {
      id: 'labor',
      title: 'Labor Rates',
      icon: Users,
      content: [
        'Labor costs included in the Scope of Work ("Labor Costs") are estimates only. The total Labor Costs will depend on the actual number of hours worked, including any applicable overtime, which we will bill to you at prevailing rates.',
        'A standard workday for our staff is ten (10) hours per day. After the first ten (10) hours, overtime rates go into effect at one and one-half (1.5) times the regular rates of pay for the four (4) hours after the first ten (10) hours. Double time rates go into effect at two (2) times the regular rates of pay after fourteen (14) hours.',
        'If an event continues until after midnight, any hours worked after midnight for the same event shall be considered part of the previous calendar day for purposes of calculating hours and overtime applicability.',
        'All labor between the hours of 12:01 AM and 6:00 AM will be billed at 2 times the prevailing rate regardless of the number of hours worked.',
        'Pinnacle Live Labor must have at least eight consecutive hours off between each shift or Labor will be charged at 1.5 times the prevailing rate beginning at hour one of the subsequent shifts.',
        'On federal and state holidays, labor rates are two times the regular rates of pay.',
        'Meal Periods: Operators require a 1 hour paid break period for every 5 hours of consecutive work. Should this requirement not be met, a meal penalty of 2 times the prevailing rate will be applied to each position and the client must supply Hotel prepared meals for the crew. Operators are not permitted to eat at their stations and, therefore, a minimum of 30 minutes should be allotted to allow operators to step away.',
      ]
    },
    {
      id: 'equipment-rates',
      title: 'Equipment Rates',
      icon: DollarSign,
      content: [
        'Client agrees to pay to Pinnacle Live the rental fee for the Equipment during the rental period specified in the Scope of Work ("Rental Fee"). The Rental Fee is calculated in full-day increments based on the rental rate for each piece of Equipment per calendar day.',
        'Additional charges may apply if your actual rental period exceeds the number of days identified in the Scope of Work.',
        'A single event that continues until after midnight into the following calendar day may be considered a single day for purposes of calculating the Rental Fee only if provided in the Scope of Work or otherwise in writing by us.',
      ]
    },
    {
      id: 'admin-fee',
      title: 'Administration Fee',
      icon: FileText,
      content: [
        'If an administration fee is included in the Scope of Work, then the terms of this paragraph shall apply. An administration fee allows Pinnacle Live to provide the necessary support required to help make your meeting or event successful, including pre-program planning and preparation, on-site support, coordination with our hotel partners and more. The entire charge or fee helps cover our administrative costs and is not a gratuity in whole or part to employees of Pinnacle Live or any other party.',
      ]
    },
    {
      id: 'equipment',
      title: 'Equipment',
      icon: Package,
      content: [
        'Pinnacle Live retains all title and rights to Equipment and accessories, and Client shall ensure that no liens, claims or encumbrances are attached or placed on any Equipment.',
        'After Pinnacle Live personnel set up the Equipment, Client will have the opportunity to test the Equipment and identify any potential problems with the Equipment before Pinnacle Live personnel depart. After such time, Client is deemed to have inspected and tested the Equipment and agrees to have received the Equipment in good operating condition.',
        'Client agrees to allow Pinnacle Live access to the Equipment, and to each location under Client\'s control where the Equipment is located at any time, for the purpose of implementation, service and/or removal.',
        'Client agrees to use the Equipment in good faith and in accordance with all instructions provided by Pinnacle Live. Client further agrees to notify Pinnacle Live as soon as practicable in the event of any interruption of service or damaged or defective Equipment.',
        'Pinnacle Live shall repair any damaged or defective Equipment or, if unable to repair it, use reasonable efforts to replace the Equipment with similar Equipment, if available, as soon as practicable. However, Pinnacle Live shall have no such obligation if it determines, in its sole discretion, that the Equipment has been subjected to: (a) abuse, misuse, negligence, improper handling, abnormal physical stress, abnormal environmental conditions, or use contrary to any instructions provided by Pinnacle Live; or (b) use with any third-party product, hardware, software, or product that has not been previously approved in writing by Pinnacle Live.',
        'If you are providing a personal computer or other equipment that will be used for presentation purposes during your event, the computer or other equipment should be tested with the Equipment in advance to ensure compatibility. Please be sure you are familiar with the operation of your computer or other equipment, as well as any associated software. You are responsible for the setting up and removal of such equipment.',
        'We strongly recommend the use of surge protectors for all computers and equipment provided by Client.',
        'All Equipment rentals are for use in the specific room or other location identified in the Scope of Work. Client shall not move Equipment from the initial set up location to a different location.',
        'All Equipment and any other materials furnished by Pinnacle Live shall be removed only by Pinnacle Live at the close of your event in accordance with the Scope of Work.',
        'These prices do not include electrical orders from AmpRite Electrical Service nor internet charges. A Managed Internet Services (MIS) specialist from Pinnacle Live can assist with additional capabilities and proposal clarification or creation.',
      ]
    },
    {
      id: 'damage',
      title: 'Damage & Security',
      icon: Shield,
      content: [
        'Client hereby assumes all responsibility for any and all damage or loss to the Equipment and agrees to pay all costs to repair or replace any Equipment damaged or lost, unless such loss or damage is caused by Pinnacle Live\'s sole negligence. All costs shall be based upon repair costs for reparable Equipment or full replacement cost for lost, stolen, or irreparable Equipment.',
        'If Client requires security, Equipment is to be left on show-site overnight or Pinnacle Live otherwise determines security is necessary during an event, Client will be responsible for all costs of providing such security.',
      ]
    },
    {
      id: 'loss-waiver',
      title: 'Loss/Damage Waiver',
      icon: Shield,
      content: [
        'If elected by Client and included as a fee in the Scope of Work, Pinnacle Live agrees to waive any charges for loss or damage to Pinnacle Live owned Equipment, provided that: (a) if any loss or damage occurs, Client agrees it will participate in any investigation by Pinnacle Live, the venue, insurers, law enforcement or other authorities; and (b) If Pinnacle determines the loss or damage was intentionally caused by Client or its representatives, the waiver will not apply and Client shall be liable for all such loss or damage.',
      ]
    },
    {
      id: 'payment',
      title: 'Payment',
      icon: CreditCard,
      content: [
        'MASTER BILL – All charges will be applied to Client\'s venue master bill upon approval with the venue, unless otherwise set forth in the Scope of Work.',
        'DIRECT BILL – In the event charges are directly billed to the Client, the Client shall submit any applicable payment to Pinnacle Live via wire transfer, ACH Transfer, credit card or check in accordance with the Scope of Work. We must receive the initial payment at least two (2) weeks prior to the date of the event. Unless otherwise agreed by Pinnacle Live in writing, the minimum initial payment due is an amount equal to 100% of all estimated charges listed in the Scope of Work. After the close of your event, we will send you a final invoice if the actual amount owed by you exceeds the payments made. Final payment must be received by us within 30 days of submission of the final invoice.',
        'Client shall provide a valid credit card to us prior to date of the event. Client hereby acknowledges by its signature that all payments, fees, or other amounts owed by Client in connection with this Agreement, as well as any damage or loss to the Equipment, may be charged to Client\'s credit card in lieu of other financial agreements, unless otherwise set forth in the Scope of Work. Credit card charges shall incur a 4% convenience fee.',
        'If necessary to enforce the collection of amounts due to us under this Agreement, Client agrees to pay all collection costs and charges incurred by us, including court costs and reasonable attorneys\' fees.',
        'The estimated charges do not include any electrical or network charges that may be incurred. Those may be added at the conclusion of the event.',
      ]
    },
    {
      id: 'cancellation',
      title: 'Cancellation',
      icon: XCircle,
      content: [
        'Unless otherwise agreed to in writing, if Client cancels the scheduled event more than 30 days prior to the start of the event, Client will not be charged any cancellation fee, except for any out-of-pocket expenses incurred by Pinnacle Live.',
        'In the event of a full or partial cancellation less than 30 days, but more than 72 hours, prior to the start of the event, Client shall pay Pinnacle Live 50% of the price set forth in the Agreement, plus any out-of-pocket expenses incurred by Pinnacle Live.',
        'In the event of full or partial cancellation less than 72 hours prior to the start of the scheduled event, Client shall pay Pinnacle Live 100% of the price set forth in the Agreement.',
        'ALL CANCELLATIONS MUST BE MADE IN WRITING AND RECEIVED BY PINNACLE LIVE\'S ON-SITE REPRESENTATIVE BEFORE BECOMING EFFECTIVE.',
      ]
    },
    {
      id: 'changes',
      title: 'Changes to Scope of Work',
      icon: Edit,
      content: [
        'Prior to the first day of the event, Pinnacle Live will provide an updated estimate of Rental Fees, Labor Costs, and any other applicable charges for approval and signature.',
        'Any requests for additional services or equipment are subject to the availability of our personnel and equipment. Pinnacle live will attempt to accommodate all such requests but will not be liable to Client for any failure to do so.',
        'Client must provide to us the name(s) of approved personnel authorized to make changes to the Scope of Work on Client\'s behalf.',
        'You must notify the Pinnacle Live contact listed in the Scope of Work to request any changes.',
        'All approved changes to the Scope of Work must be in writing.',
      ]
    },
    {
      id: 'internet',
      title: 'Internet/Network Equipment and Services',
      icon: Wifi,
      content: [
        'Client understands and agrees that Pinnacle Live does not own or control the network telecommunications facilities used to access the internet and that the internet is a non-regulated public domain.',
        'You, or your designated IT professional, will be responsible for appropriate configuration of your personal computers and other equipment authorized by us for your use relating to the Services and Equipment provided by Pinnacle Live. Under no circumstance will Pinnacle Live personnel be responsible for making configuration changes to any computer or other equipment not provided by us.',
        'Client understands and agrees that Pinnacle Live does not guaranty the operability of any network or Internet services and shall not, under any circumstances, be liable or responsible in any way for any Internet or network related disruptions, failures, Client or third party supplied cables and/or equipment or any other issues or problems related to Internet or network services used by Client above and beyond the agreed upon service price.',
        'Under no circumstances shall Client attempt to gain unauthorized access to or tamper with any part of the network.',
        'All wireless access points not authorized by Pinnacle Live in writing are prohibited. Wireless access points without adjustable power outputs are prohibited under all circumstances.',
        'Pinnacle Live reserves the right to disconnect any equipment (without refund) that, in Pinnacle Live\'s sole discretion, is found to be causing overall network problems.',
        'If you wish to showcase your wireless products, you must contact Pinnacle Live at least fourteen (14) days prior to the start of the event so that we may attempt (but do not guarantee) to engineer a cohesive operating network that limits or controls interference. Approvals may incur a site survey fee.',
        'The network may only be used for lawful purposes and in accordance with these Terms. Transmission of any materials in violation of any local, state or federal laws or regulations is prohibited including, not limited to, trade secret materials, copyrighted materials, materials that are threatening or obscene.',
        'Wireless internet service is vulnerable to interference or disruption from other devices that may impact the service provided to Client. Pinnacle Live does not guarantee that interference or disruption will not occur. For any critical presentations, Pinnacle Live recommends Client purchase hardwired services, if available.',
      ]
    },
    {
      id: 'exhibitors',
      title: 'Additional Terms for Exhibitors',
      icon: Building2,
      content: [
        'Insurance and security for the Equipment is solely your responsibility. You must maintain an insurance policy that covers loss or damage to the Equipment in an amount not less than the Equipment\'s full replacement value as identified on the Scope of Work and, if requested, such policy must list Pinnacle Live as an additional insured. You must provide us a copy of the policy prior to receiving any Equipment and ensure the policy remains active until after we have confirmed receipt of payment for the final invoice.',
        'Union labor costs, if applicable, are not included in the Rental Fee.',
        'No refunds or credits will be issued after the event ends.',
        'Your booth might not have designated outlets, including column and wall outlets. You are responsible for identifying the number of outlets you will need and including the number and type of outlets, including any extension cords and surge protectors, in your Equipment reservation. If you require separate outlets, additional fees apply for each piece of Equipment to be connected. Please contact Pinnacle Live for details.',
        'You are responsible for providing all necessary cables and connectors required to utilize the designated electrical connection points. All installations and connections must be performed by a Pinnacle Live team member.',
        'All cables and wiring in public view must be properly secured to the floor and/or wall. All tape must be approved by the hotel or applicable venue management before being applied to ground coverings. Cables and wiring that cannot be properly secured by tape must be covered and secured with a proper cable ramp.',
        'All cords, plugs, and power strips must be UL listed, in good repair, and all equipment to be powered must be labeled with the accurate type of current, voltage, phase, cycle, horsepower, etc. These items are available to rent from Pinnacle Live.',
        'All equipment provided by and used Client must comply with current NEC, federal, state, and local codes.',
      ]
    },
    {
      id: 'indemnification',
      title: 'Indemnification',
      icon: Scale,
      content: [
        'Client and Pinnacle Live (each, as applicable, an "Indemnifying Party") hereby forever agree to defend, indemnify and hold harmless the other for any and all third-party claims, losses, costs (including reasonable attorneys\' fees and costs), damages, or injury to property or persons (including death), as a result of the negligence or willful misconduct of the Indemnifying Party and/or its respective employees, agents, representatives or contractors.',
        'Client also agrees to defend, indemnify and hold harmless Pinnacle Live, its affiliates and their respective personnel against violation of any (a) show or event rule, policy or regulation published or set forth by the show or event venue; and/or (b) copyright, patent or other intellectual property infringement including, but not limited to, any and all claims related to Pinnacle Live\'s use of materials, recordings, videos, transmissions, software and/or hardware provided by Client.',
      ]
    },
    {
      id: 'liability',
      title: 'Limitation of Liability',
      icon: AlertCircle,
      content: [
        'IN NO EVENT SHALL PINNACLE LIVE BE LIABLE TO CLIENT OR TO ANY THIRD PARTY FOR ANY LOSS OF USE, REVENUE OR PROFIT, OR LOSS OF DATA OR DIMINUTION IN VALUE, OR FOR ANY CONSEQUENTIAL, INCIDENTAL, INDIRECT, EXEMPLARY, SPECIAL, OR PUNITIVE DAMAGES WHETHER ARISING OUT OF BREACH OF CONTRACT, TORT (INCLUDING NEGLIGENCE), OR OTHERWISE, REGARDLESS OF WHETHER SUCH DAMAGES WERE FORESEEABLE AND REGARDLESS OF WHETHER PINNACLE LIVE HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES, AND NOTWITHSTANDING THE FAILURE OF ANY AGREED OR OTHER REMEDY OF ITS ESSENTIAL PURPOSE.',
        'IN NO EVENT SHALL PINNACLE LIVE\'S AGGREGATE LIABILITY ARISING OUT OF OR RELATED TO THIS AGREEMENT, WHETHER ARISING OUT OF OR RELATED TO BREACH OF CONTRACT, TORT (INCLUDING NEGLIGENCE) OR OTHERWISE, EXCEED THE AGGREGATE AMOUNTS PAID OR PAYABLE TO US PURSUANT TO THIS AGREEMENT.',
        'REQUESTS FOR RECORDING: ALL RECORDINGS AND EDITS ARE CLAIMED TO BE OF A QUALITY SUITABLE FOR DOCUMENTATION AND TRANSCRIPTION PURPOSES ONLY.',
      ]
    },
    {
      id: 'warranties',
      title: 'Exclusion of Warranties',
      icon: XCircle,
      content: [
        'PINNACLE LIVE MAKES NO WARRANTY WHATSOEVER REGARDING THE EQUIPMENT OR ITS SERVICES, EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY (a) WARRANTY OF MERCHANTABILITY; (b) WARRANTY OF FITNESS FOR A PARTICULAR PURPOSE; (c) WARRANTY AGAINST INTERFERENCE; OR (d) WARRANTY AGAINST INFRINGEMENT OF ANY PATENT, COPYRIGHT, TRADEMARK, TRADE SECRET, OR OTHER PROPRIETARY RIGHTS OF A THIRD PARTY; WHETHER ARISING BY LAW, COURSE OF DEALING, COURSE OF PERFORMANCE, USAGE OF TRADE, OR OTHERWISE.',
      ]
    },
    {
      id: 'force-majeure',
      title: 'Force Majeure',
      icon: Cloud,
      content: [
        'The parties\' performance under this Agreement is subject to governmental actions or regulations; acts of God, hurricanes, earthquakes, other adverse weather conditions; war or terrorism; strikes or other labor disputes; third party failures; or any other emergency of comparable nature beyond the parties\' control; in each instance making it impossible, illegal or impracticable to perform its obligations under this Agreement (each a "Force Majeure Event").',
        'In the event of the occurrence of a Force Majeure Event, the parties agree that, if possible, the event that is the subject of this Agreement will be rescheduled at the first available opportunity suitable for each party.',
        'If the parties are unable to reschedule due to a Force Majeure Event, this Agreement may be terminated upon reasonable written notice without a cancellation charge as set forth herein, provided that in the event of any cancellation or postponement of the event or termination of this Agreement due to a Force Majeure Event, Pinnacle Live will return to Client any and all prepayments and deposits made by Client, less reimbursement for any work performed and expenses incurred by Pinnacle Live up through the date of cancellation, postponement or termination.',
        'If Client has not provided a deposit or prepayment for such expenses and/or work performed, Client shall, within fourteen days of invoice, pay Pinnacle Live for all such expenses and work.',
      ]
    },
    {
      id: 'governing-law',
      title: 'Governing Law and Venue',
      icon: Scale,
      content: [
        'This Agreement shall be governed by and interpreted in accordance with the laws of the state where the event is located, without regard to conflicts of law provisions.',
        'Any and all claims, actions, disputes or controversies arising out of or related to this Agreement shall be litigated only in the state or federal court located in the same state and closest to the event location.',
      ]
    },
    {
      id: 'entire-agreement',
      title: 'Entire Agreement; Modification',
      icon: FileText,
      content: [
        'This Agreement supersedes all previous verbal or written contracts with respect to the subject matter hereof and may only be modified by written agreement signed by both parties.',
        'These Terms and the Agreement prevail over any of Client\'s general terms and conditions regardless of whether or when Client has submitted its request, order, or such general terms and conditions.',
        'Provision of Equipment or Services to Client does not constitute acceptance of any of Client\'s terms and conditions and does not serve to modify or amend these Terms or the Agreement.',
      ]
    }
  ];

  return (
    <div className="w-full bg-white mt-8">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-6 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-gray-700" />
            <h2 className="text-base font-semibold text-gray-900">General Terms & Conditions</h2>
          </div>
          <p className="text-xs text-gray-600 mt-2 ml-8 leading-relaxed">
            These General Terms and Conditions ("Terms") apply to and govern the provision of equipment, labor and services by Pinnacle Live LLC ("Pinnacle Live", "us" or "we") to the client ("Client" or "you") as set forth in the attached or referenced Scope of Work and/or similar order document(s). The Scope of Work, any approved change order and these Terms constitute the entire agreement (the "Agreement") between the Client and Pinnacle Live.
          </p>
          <p className="text-xs text-gray-600 mt-2 ml-8 leading-relaxed">
            The Scope of Work, including any pricing, discounting, and concessions set forth therein, is valid for thirty (30) days prior to the start date of the event. All prices and availability are subject to change without notice until this Agreement is accepted and signed, and any required deposit is received.
          </p>
        </div>

        {/* Important Notice */}
        <div className="mb-6 p-3 bg-gray-50 border border-gray-200 rounded">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-gray-700 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-gray-700">
              <p className="font-medium mb-1">Important Legal Information</p>
              <p className="text-gray-600 leading-relaxed">
                Client agrees to pay for the charges for equipment ("Equipment"), labor ("Labor") and services ("Services") set forth in the Scope of Work, subject to these Terms. Please review carefully before signing.
              </p>
            </div>
          </div>
        </div>

        {/* Collapsible Sections */}
        <div className="space-y-2 mb-6">
          {termsData.map((section) => {
            const IconComponent = section.icon;
            return (
              <div key={section.id} className="border border-gray-200 rounded overflow-hidden">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between p-3 bg-white hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-4 w-4 text-gray-700" />
                    <span className="text-xs font-medium text-gray-900 text-left">{section.title}</span>
                  </div>
                  {isExpanded(section.id) ? (
                    <ChevronDown className="h-4 w-4 text-gray-600 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-600 flex-shrink-0" />
                  )}
                </button>
                
                {isExpanded(section.id) && (
                  <div className="px-3 py-2 bg-gray-50 border-t border-gray-200">
                    <ul className="space-y-2">
                      {section.content.map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-xs text-gray-700">
                          <span className="text-gray-400 mt-1">•</span>
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>

       
      </div>
    </div>
  );
};

export default TermsConditionsCard;