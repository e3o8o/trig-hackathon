# 🚀 Trig Protocol + StewardChain: Team Briefing & User Stories

**Project**: Christian Financial Stewardship Platform on Blockchain
**Duration**: 72-hour Hackathon
**Team Size**: 3 members (2 developers + 1 non-technical)
**Target**: Working demo with real-world use cases

---

## 🎯 **What Are We Building? (30-Second Pitch)**

We're building **StewardChain** - a blockchain platform that helps Christians practice faithful financial stewardship through automated giving, mission trip protection, and transparent church accountability. It's powered by **Trig Protocol**, which enables smart contracts that automatically execute when real-world conditions are met.

**Think of it as**: "If This, Then That" (IFTTT) for Christian giving and insurance, backed by real money from DeFi protocols.

---

## 👥 **Team Roles & Responsibilities**

### **Developer 1 (Smart Contract Focus)**
**Primary**: Backend blockchain development
- Build core Trig Protocol contracts
- Implement Christian oracle system
- Create DeFi backing integration
- Write comprehensive tests
- Deploy to Base testnet

**Skills Needed**: Solidity, Hardhat, Testing

### **Developer 2 (Frontend + Integration Focus)**
**Primary**: User interface and integration
- Build Next.js frontend with wallet connection
- Create forms for tithe and mission protection
- Integrate smart contracts with UI
- Handle transaction flows
- Design responsive layouts

**Skills Needed**: React/Next.js, TypeScript, Web3 (wagmi/viem)

### **Non-Technical Team Member (Product + Demo Focus)**
**Primary**: User experience and storytelling
- Define user flows and requirements
- Create demo script and scenarios
- Test user experience
- Prepare presentation materials
- Record demo video
- Manage documentation

**Skills Needed**: Communication, storytelling, user empathy

---

## 📖 **Core User Stories**

### **Epic 1: Automated Tithing System**

#### **User Story 1.1: Create Tithe Commitment**
```
AS A Christian believer
I WANT TO set up automatic tithing to my church
SO THAT I can practice consistent biblical giving without manual effort
```

**Acceptance Criteria**:
- ✅ User can connect their wallet
- ✅ User can select a verified church from a list
- ✅ User can set income threshold (e.g., "$5,000/month")
- ✅ User can set tithe percentage (e.g., "10%")
- ✅ User can add additional offering percentage (e.g., "5% to missions")
- ✅ User can preview the commitment before confirming
- ✅ Transaction is recorded on blockchain
- ✅ User receives confirmation

**User Journey**:
```mermaid
graph LR
    A[Connect Wallet] --> B[Browse Churches]
    B --> C[Select Church]
    C --> D[Set Income Threshold]
    D --> E[Set Percentages]
    E --> F[Preview Commitment]
    F --> G[Sign Transaction]
    G --> H[Confirmation]
```

**Example Scenario**:
> Sarah is a software engineer earning $8,000/month. She wants to tithe 10% to her local church and give an additional 5% to missions. She sets up her commitment once, and every month when her income comes in, the system automatically transfers $800 to her church and $400 to missions.

#### **User Story 1.2: Execute Tithe Payment**
```
AS A believer with a tithe commitment
I WANT my tithe to execute automatically when I receive income
SO THAT I don't forget to give and practice faithful stewardship
```

**Acceptance Criteria**:
- ✅ System monitors when user receives income
- ✅ Calculates correct tithe amount based on percentage
- ✅ Splits payment between church and missions if specified
- ✅ Executes transfer automatically
- ✅ Records transaction in giving history
- ✅ Sends notification to user and church
- ✅ Generates giving receipt

**User Journey**:
```mermaid
graph TD
    A[Income Received] --> B[System Detects Income]
    B --> C[Calculate Tithe Amount]
    C --> D[Verify Church Address]
    D --> E[Execute Transfer]
    E --> F[Update Giving History]
    F --> G[Send Notifications]
    G --> H[Generate Receipt]
```

**Example Scenario**:
> Sarah receives her monthly salary on the 1st of each month. The system automatically detects this, calculates her 10% tithe ($800) and 5% offering ($400), and transfers the funds to her church and missions fund. She receives a notification with her giving receipt for tax purposes.

#### **User Story 1.3: View Giving History**
```
AS A believer who tithes
I WANT TO see my complete giving history
SO THAT I can track my stewardship and have records for tax purposes
```

**Acceptance Criteria**:
- ✅ User can view all past tithe payments
- ✅ See amounts, dates, and recipients
- ✅ View running totals (yearly, lifetime)
- ✅ Export giving statements
- ✅ See blockchain proof of each payment

**Example Scenario**:
> At tax time, Sarah needs her annual giving statement. She logs into StewardChain, views her complete history, and exports a report showing she gave $9,600 to church and $4,800 to missions in 2024.

---

### **Epic 2: Mission Trip Protection**

#### **User Story 2.1: Purchase Mission Protection**
```
AS A missionary preparing for international service
I WANT TO purchase insurance for my mission trip
SO THAT I'm protected if the trip is disrupted or cancelled
```

**Acceptance Criteria**:
- ✅ User can enter trip destination
- ✅ User can select trip dates
- ✅ User can choose coverage amount
- ✅ System calculates premium automatically
- ✅ User can review policy details
- ✅ User can pay premium and receive policy
- ✅ Policy is recorded on blockchain

**User Journey**:
```mermaid
graph LR
    A[Connect Wallet] --> B[Enter Destination]
    B --> C[Select Dates]
    C --> D[Choose Coverage]
    D --> E[View Premium]
    E --> F[Review Policy]
    F --> G[Pay Premium]
    G --> H[Receive Policy]
```

**Example Scenario**:
> Pastor John is leading a mission trip to Kenya for 30 days. He purchases a $2,000 coverage policy for a $100 premium. If the trip is cancelled due to political unrest or his flight is significantly delayed, he automatically receives the payout.

#### **User Story 2.2: File Mission Trip Claim**
```
AS A missionary with trip protection
I WANT TO file a claim if my trip is disrupted
SO THAT I receive the protection payout automatically
```

**Acceptance Criteria**:
- ✅ User can submit claim with evidence
- ✅ System verifies the disruption occurred
- ✅ Church leaders verify the claim (2-of-3)
- ✅ Payout executes automatically upon verification
- ✅ User receives funds within 24 hours
- ✅ Transaction is recorded on blockchain

**User Journey**:
```mermaid
graph TD
    A[Trip Disruption Occurs] --> B[Submit Claim]
    B --> C[Upload Evidence]
    C --> D[Church Leaders Verify]
    D --> E[System Checks Conditions]
    E --> F[Execute Payout]
    F --> G[User Receives Funds]
```

**Example Scenario**:
> Pastor John's flight to Kenya is cancelled due to political unrest. He submits a claim with his cancelled flight confirmation. Three church elders verify the situation. The smart contract automatically transfers $2,000 to Pastor John's wallet within 24 hours.

---

### **Epic 3: Church Leadership Portal**

#### **User Story 3.1: Register Church**
```
AS A church leader
I WANT TO register my church on the platform
SO THAT members can tithe to us and we can verify other leaders
```

**Acceptance Criteria**:
- ✅ Leader can enter church details (name, location, denomination)
- ✅ Leader must stake 1 ETH to register
- ✅ Church information is stored on blockchain
- ✅ Church receives unique identifier
- ✅ Church appears in member search results

**Example Scenario**:
> Pastor Mike wants his church on StewardChain. He connects his wallet, enters "Grace Community Church, Dallas, TX", stakes 1 ETH as security deposit, and completes registration. Now his church members can set up automatic tithing to the church.

#### **User Story 3.2: Verify Church Leader**
```
AS A verified church
I WANT TO verify other church leaders
SO THAT they can participate in claim verification
```

**Acceptance Criteria**:
- ✅ Church can nominate leaders for verification
- ✅ Leader must stake 0.1 ETH to be verified
- ✅ Leader receives verification credentials
- ✅ Leader can now verify claims and testimonies
- ✅ Leader's verification power is based on stake amount

**Example Scenario**:
> Grace Community Church verifies three of its elders. Each elder stakes 0.1 ETH. Now these elders can verify mission trip claims, tithe commitments, and other activities, providing accountability to the system.

#### **User Story 3.3: View Received Tithes**
```
AS A church leader
I WANT TO see all tithes received by our church
SO THAT we can track donations and thank our members
```

**Acceptance Criteria**:
- ✅ Church can view all received tithes
- ✅ See donor information (with privacy options)
- ✅ View amounts and dates
- ✅ Export financial reports
- ✅ See total received (monthly, yearly)

**Example Scenario**:
> At the end of the month, Pastor Mike logs in and sees that 25 members gave a total of $15,000 in tithes. He can see individual contributions (if members haven't chosen to remain anonymous) and send thank-you messages.

---

### **Epic 4: DeFi Capital Backing**

#### **User Story 4.1: Provide Backing Capital**
```
AS A DeFi user with idle USDC
I WANT TO back insurance policies to earn yield
SO THAT my capital is productive and I earn higher returns
```

**Acceptance Criteria**:
- ✅ User can view available backing pools
- ✅ User can see current APY rates
- ✅ User can deposit USDC into pool
- ✅ User can choose lock period
- ✅ User receives position confirmation
- ✅ User can track yield earnings

**User Journey**:
```mermaid
graph LR
    A[Connect Wallet] --> B[View Pools]
    B --> C[Select Pool]
    C --> D[Enter Amount]
    D --> E[Choose Lock Period]
    E --> F[Approve USDC]
    F --> G[Deposit]
    G --> H[Receive Position NFT]
```

**Example Scenario**:
> Maria has $50,000 USDC sitting idle in Morpho earning 5% APY. She moves it to StewardChain's backing pool where she earns 12% APY (5% base + 7% from insurance premiums). Her capital backs mission trip insurance policies.

#### **User Story 4.2: Withdraw Backing**
```
AS A capital provider
I WANT TO withdraw my backing when the lock period ends
SO THAT I can access my capital and earned yield
```

**Acceptance Criteria**:
- ✅ User can view their positions
- ✅ System shows lock period remaining
- ✅ User can withdraw after lock expires
- ✅ Withdrawal includes principal + yield
- ✅ Transaction completes within minutes
- ✅ Position is marked as closed

**Example Scenario**:
> After 6 months, Maria's lock period expires. She logs in, sees she earned $6,000 in yield (12% APY), and withdraws her $56,000 total back to her wallet.

---

## 🔄 **End-to-End Process Flows**

### **Process 1: Complete Tithe Flow**

```mermaid
sequenceDiagram
    participant User as Sarah (Believer)
    participant UI as StewardChain Frontend
    participant Wallet as MetaMask Wallet
    participant Contract as AutomatedTithe Contract
    participant Church as Grace Community Church
    
    User->>UI: Visit StewardChain.com
    User->>UI: Click "Set Up Tithe"
    UI->>Wallet: Request wallet connection
    Wallet->>User: Approve connection
    
    User->>UI: Search for church
    UI->>Contract: Query verified churches
    Contract->>UI: Return church list
    
    User->>UI: Select Grace Community Church
    User->>UI: Enter $5,000 income threshold
    User->>UI: Set 10% tithe + 5% offering
    
    UI->>User: Show preview: $500 to church, $250 to missions
    User->>UI: Confirm commitment
    
    UI->>Wallet: Request transaction signature
    Wallet->>User: Show transaction details
    User->>Wallet: Sign transaction
    
    Wallet->>Contract: Create tithe commitment
    Contract->>Contract: Store commitment on-chain
    Contract->>UI: Emit CommitmentCreated event
    
    UI->>User: Show success notification
    UI->>Church: Send notification of new commitment
    
    Note over User,Church: --- Month 1: Income Received ---
    
    User->>Contract: Report income: $8,000
    Contract->>Contract: Calculate: 10% = $800, 5% = $400
    Contract->>Church: Transfer $800 (tithe)
    Contract->>Church: Transfer $400 (missions)
    Contract->>User: Send giving receipt
    
    UI->>User: Show notification: "Tithe executed: $1,200 total"
```

### **Process 2: Complete Mission Protection Flow**

```mermaid
sequenceDiagram
    participant User as Pastor John (Missionary)
    participant UI as StewardChain Frontend
    participant Wallet as MetaMask Wallet
    participant Mission as MissionProtection Contract
    participant Backing as DeFi Backing Pool
    participant Elders as Church Elders (3)
    
    User->>UI: Visit StewardChain.com
    User->>UI: Click "Mission Protection"
    
    User->>UI: Enter destination: Kenya
    User->>UI: Select dates: June 1-30
    User->>UI: Choose coverage: $2,000
    
    UI->>Mission: Calculate premium
    Mission->>UI: Premium: $100 (5% of coverage)
    
    UI->>User: Show policy preview
    User->>UI: Purchase policy
    
    UI->>Wallet: Request $100 USDC payment
    User->>Wallet: Approve payment
    
    Wallet->>Mission: Pay premium
    Mission->>Backing: Deposit premium to pool
    Mission->>Mission: Create policy on-chain
    Mission->>User: Issue policy NFT
    
    UI->>User: Show confirmation & policy details
    
    Note over User,Elders: --- Trip Disrupted ---
    
    User->>UI: Submit claim
    User->>UI: Upload flight cancellation proof
    
    UI->>Mission: Create claim request
    Mission->>Elders: Request verification (2-of-3 required)
    
    Elders->>Mission: Elder 1 approves claim
    Elders->>Mission: Elder 2 approves claim
    
    Mission->>Mission: Verify 2-of-3 threshold met
    Mission->>Backing: Request $2,000 payout
    Backing->>Mission: Transfer $2,000
    Mission->>User: Transfer $2,000 to Pastor John
    
    UI->>User: Show notification: "Claim approved & paid"
```

### **Process 3: Church Verification Flow**

```mermaid
sequenceDiagram
    participant Church as Pastor Mike (Church)
    participant UI as StewardChain Frontend
    participant Wallet as MetaMask Wallet
    participant Registry as Christian Oracle Registry
    participant Staking as Staking Contract
    participant Elder as Church Elder
    
    Church->>UI: Click "Register Church"
    Church->>UI: Enter church details
    
    UI->>Church: Show staking requirement: 1 ETH
    Church->>UI: Confirm registration
    
    UI->>Wallet: Request 1 ETH stake
    Church->>Wallet: Approve transaction
    
    Wallet->>Staking: Stake 1 ETH
    Staking->>Registry: Confirm stake received
    Registry->>Registry: Create church record
    Registry->>Church: Issue church verification badge
    
    UI->>Church: Show success: "Church registered!"
    
    Note over Church,Elder: --- Verifying Leaders ---
    
    Church->>UI: Click "Verify Leader"
    Church->>UI: Enter elder wallet address
    
    UI->>Registry: Check church permissions
    Registry->>UI: Church authorized to verify
    
    UI->>Elder: Send verification invitation
    Elder->>UI: Accept invitation
    
    UI->>Wallet: Request 0.1 ETH stake from elder
    Elder->>Wallet: Approve stake
    
    Wallet->>Staking: Stake 0.1 ETH
    Staking->>Registry: Confirm elder stake
    Registry->>Elder: Grant verification power
    
    UI->>Elder: Show verification dashboard
    UI->>Church: Update leader list
```

---

## 🎬 **Demo Script (5 Minutes)**

### **Minute 1: Introduction & Problem**
**Speaker**: Non-Technical Team Member

> "Hi, I'm [Name] and we're presenting StewardChain. 
> 
> Did you know that Christians give over $50 billion annually to churches, but the process is manual, inconsistent, and lacks transparency? Mission trips worth millions of dollars have no protection when they're disrupted. And there's $16 billion of idle capital in DeFi earning minimal returns.
>
> StewardChain solves all three problems at once."

### **Minute 2: Solution Overview**
**Speaker**: Developer 1

> "We built two things: Trig Protocol - a blockchain infrastructure for parametric conditions, and StewardChain - Christian applications on top.
>
> Let me show you our architecture..."
> 
> [Show architecture diagram]
>
> "The core innovation is using DeFi idle capital to back real insurance, creating a win-win for everyone."

### **Minute 3: Live Demo - Automated Tithe**
**Speaker**: Developer 2

> "Let me show you Sarah setting up her tithe. She connects her wallet...
> 
> [Live action on screen]
> 
> She selects her church... enters her income threshold... sets 10% for tithe and 5% for missions...
>
> And boom - one transaction, her commitment is on the blockchain. Now every month, when she receives income, the system automatically tithes for her.
>
> [Show execution happening]
>
> Here's her giving history - fully transparent, immutable, and tax-ready."

### **Minute 4: Live Demo - Mission Protection**
**Speaker**: Developer 2

> "Now let's buy mission trip insurance. Pastor John enters his destination Kenya, dates June 1-30, wants $2,000 coverage...
>
> [Live action on screen]
>
> System calculates a $100 premium - way cheaper than traditional insurance because we're using DeFi backing.
>
> He pays, gets his policy instantly.
>
> [Show claim submission]
>
> Trip gets disrupted - he submits claim, church elders verify, and in 24 hours, $2,000 hits his wallet automatically. No paperwork, no waiting weeks."

### **Minute 5: Impact & Vision**
**Speaker**: Non-Technical Team Member

> "Let me show you the impact:
>
> [Show statistics slide]
>
> - Churches: Predictable income, full transparency
> - Believers: Effortless giving, complete history
> - Missionaries: Protection without bureaucracy
> - DeFi users: Higher yields backing real-world impact
>
> We built this in 72 hours, but the vision is massive - $50B+ market opportunity.
>
> StewardChain proves that blockchain can serve faith, not replace it. Thank you!"

---

## 📊 **Team Coordination Plan**

### **Day 1 (Hours 0-24): Foundation**

**Developer 1 Tasks**:
- Hours 0-6: Set up Hardhat, deploy core contracts
- Hours 6-12: Complete TrigImmutableCore
- Hours 12-18: Testing and optimization
- Hours 18-24: Deploy to testnet

**Developer 2 Tasks**:
- Hours 0-6: Set up Next.js, configure wagmi
- Hours 6-12: Build layout and wallet connection
- Hours 12-18: Create contract hooks
- Hours 18-24: Build dashboard page

**Non-Technical Member Tasks**:
- Hours 0-6: Review user stories, create scenarios
- Hours 6-12: Test developer 2's UI flows
- Hours 12-18: Draft demo script v1
- Hours 18-24: Create test data and personas

**Daily Sync**: End of Day 1 (30 min)
- Review what's completed
- Identify blockers
- Adjust Day 2 plan

### **Day 2 (Hours 24-48): Core Features**

**Developer 1 Tasks**:
- Hours 24-30: Christian Oracle Registry
- Hours 30-36: Automated Tithe contract
- Hours 36-42: Mission Protection contract
- Hours 42-48: Deploy and test all contracts

**Developer 2 Tasks**:
- Hours 24-30: Build tithe creation form
- Hours 30-36: Build mission protection form
- Hours 36-42: Integrate with smart contracts
- Hours 42-48: Add transaction monitoring

**Non-Technical Member Tasks**:
- Hours 24-30: Test tithe creation flow
- Hours 30-36: Test mission protection flow
- Hours 36-42: Document all user flows
- Hours 42-48: Create presentation slides

**Daily Sync**: End of Day 2 (30 min)
- Demo features to each other
- Identify UX issues
- Plan Day 3 polish

### **Day 3 (Hours 48-72): Polish & Demo**

**Developer 1 Tasks**:
- Hours 48-54: DeFi backing integration
- Hours 54-60: Bug fixes and testing
- Hours 60-66: Final deployment
- Hours 66-72: Support demo preparation

**Developer 2 Tasks**:
- Hours 48-54: Complete all UI pages
- Hours 54-60: Polish and responsive design
- Hours 60-66: Bug fixes and testing
- Hours 66-72: Support demo preparation

**Non-Technical Member Tasks**:
- Hours 48-54: Finalize demo script
- Hours 54-60: Practice demo (multiple times)
- Hours 60-66: Record demo video
- Hours 66-72: Create final presentation

**Final Sync**: Hour 66 (1 hour)
- Complete practice run
- Identify any last issues
- Assign final tasks

---

## 🎯 **Success Criteria**

### **For Judges**
✅ We can execute a complete tithe setup and payment live
✅ We can show mission protection purchase and claim
✅ We can demonstrate DeFi backing working
✅ All transactions are on-chain and verifiable
✅ UI is polished and professional

### **For Team**
✅ All critical path tasks completed
✅ No major bugs in demo scenarios
✅ Everyone can explain their part
✅ Demo stays under 5 minutes
✅ Presentation is clear and compelling

### **For Future**
✅ Code is documented and maintainable
✅ Architecture can scale post-hackathon
✅ Clear path to production
✅ Investor-ready materials

---

## 📚 **Resources & Links**

### **For Developers**
- Architecture: `/ARCHITECTURE.md`
- Task Tracker: `/TASK_TRACKER.md`
- Base Sepolia Faucet: https://faucet.quicknode.com/base/sepolia
- LayerZero Docs: https://docs.layerzero.network
- OpenZeppelin Contracts: https://docs.openzeppelin.com
- wagmi Documentation: https://wagmi.sh
- shadcn/ui Components: https://ui.shadcn.com

### **For Non-Technical Member**
- User stories (this document)
- Christian use case examples
- Demo script template (above)
- Presentation outline (above)

### **Communication**
- Daily sync times: 8am, 2pm, 8pm (or adjust for team)
- Emergency blockers: Immediate Slack/Discord
- Progress updates: Async in shared doc
- Questions: Ask early and often!

---

## 💡 **Key Messages to Remember**

### **What Makes This Special?**
1. **Real-World Impact**: Helping Christians practice faithful stewardship
2. **Technical Innovation**: DeFi capital backing blockchain insurance
3. **User Experience**: Simple, automatic, transparent
4. **Market Opportunity**: $50B+ Christian giving market
5. **Scalable Architecture**: Built to grow beyond hackathon

### **The "Wow" Moments**
1. **Automatic tithing**: Set it once, forget it, perfect giving history
2. **Instant claims**: 24-hour payout vs weeks with traditional insurance
3. **Community verification**: Church leaders provide accountability
4. **Higher yields**: DeFi users earn more backing real impact
5. **Full transparency**: Every dollar tracked on blockchain

### **The Vision Statement**
> "StewardChain proves that blockchain technology can enhance faith-based giving without replacing the personal relationships that make churches communities. We're not disrupting churches - we're equipping them with 21st-century tools to serve their missions better."

---

## 🚀 **Next Steps**

### **Immediate (Hour 0)**
1. **All team members**: Read this document fully
2. **Developers**: Review `/ARCHITECTURE.md` and `/TASK_TRACKER.md`
3. **Non-technical**: Create detailed demo personas
4. **Everyone**: First team sync to confirm understanding

### **First Deliverables (Hour 6)**
- **Developer 1**: Core contracts deployed to local network
- **Developer 2**: Frontend running with wallet connection
- **Non-technical**: Demo script v1 draft complete

### **First Demo (Hour 24)**
- **Everyone**: Internal demo of current progress
- Tithe flow should be partially working
- UI should have basic layout

### **Final Demo (Hour 72)**
- **Everyone**: Ready to present to judges
- All features working
- Demo video recorded
- Presentation polished

---

## ❓ **FAQ for Team**

**Q: What if we fall behind schedule?**
A: We have 27 hours of buffer time built in. Focus on critical path tasks first (marked in task tracker). Cut nice-to-have features if needed.

**Q: What if we encounter a blocker?**
A: Raise it immediately in team chat. Don't struggle alone for more than 30 minutes. We have alternative approaches documented.

**Q: How technical does the non-technical member need to be?**
A: Not very! You need to understand the user experience and be able to explain it clearly. You'll test the UI and provide feedback, but won't write code.

**Q: What if a smart contract has a bug during the demo?**
A: We'll have a recorded video backup. Also, we'll practice the demo multiple times to ensure stability. The non-technical member should be ready to continue smoothly even if something breaks.

**Q: How do we divide work if one person finishes early?**
A: Jump to the next critical task, or help test/document what others are building. There's always more to do!

**Q: What if judges ask technical questions?**
A: Developer 1 handles smart contract questions. Developer 2 handles frontend/integration questions. Non-technical member handles product/market questions. We'll practice Q&A together.

---

**Document Created**: ✅  
**Team Ready**: Pending review  
**Next Action**: Full team sync to discuss and confirm understanding

**Remember**: We're building something meaningful. Have fun, support each other, and create something the Christian community will actually use! 🙏

