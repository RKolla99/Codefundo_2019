# Codefundo_2019

<b> Major problems in the current election system : </b>
<ol>
    <li> People not currently living  in their constituency have to travel a lot to vote </li>
    <li> Amount of money, time and effort spent with transportation of the EVMs to counting center. Counting votes from each EVM is time taking and hence the time taken for announcing the result increases. </li>
    <li> Labour required to verify voters name in the list(i.e whether voter belongs to that constituency) </li>
</ol>

<b> Solution Outline : </b>
<p>
          We plan to integrate the Aadhar card information, mainly the biometrics with the voting process. The biometric information will be used to authenticate the voters. The information will be stored in a permissioned ledger blockchain network. Through this voters can just go to their nearest voting booth and cast their vote from anywhere in the country. 
          The votes are stored as transactions/entries in a second permissioned ledger blockchain network. This ledger can be read by anyone but adding to the ledger requires permission. Since the biometric information is the mode of authentication, people cannot identify who the votes were cast by. 
          Once the election is over, the votes can be counted instantaneously and the results announced within a short interval of time. All permissions and ownerships rest with the Election Commission of India. The model can be used by any other central authority conducting elections too.
</p>
<b> Detailed Idea : </b> <br>
  Phase 1: PRE-ELECTION
          We plan on using the Aadhar card information to create a digital ID which has all information ranging from voting constituency to biometrics, the constituency will be determined using the Aadhar address. To identify each eligible voter we create a permissioned ledger blockchain network which comes to a consensus of which voters are eligible to vote. The voters information is stored in the ledger which does disallows anyone from tampering with the list of eligible voters. The ledger is limited to a single constituency, so each constituency has its own network and ledger of eligible voters. This system allows us to monitor citizens of a particular constituency and create/store a digital ID as soon as they become eligible(turn 18), it also solves the problem of name missing from the voters list. <br>  
  Phase 2: ELECTION
          A new EVM will be introduced with a fingerprint and retinal scan which takes care of the authentication and nullifies the use of manual labour, the EVM is also connected to a secure network. The voter enters his constituency in the EVM and then gives a fingerprint and retinal scan. The EVM authenticates the information with the list of eligible voters stored in the ledger(generated pre-election) for that constituency. Once verified the user can go ahead and vote. For each constituency we create a new blockchain network and ledger to store the votes in a suitable hashed format. This is also a permissioned ledger but can be read by anyone, so each vote becomes a new entry in the ledger of the constituency. This system allows complete transparency as the ledger can be read by anyone so any attempt to tamper with or hack the system can be identified. Also it allows the voter to vote in any voting booth. All they have to do is to enter their constituency and use their biometrics to verify that they belong to that constituency. This allows voters living in different locations to vote in their nearest voting booths. Since all the votes for each constituency is stored in a blockchain network, the vote becomes immutable making the process secure. The vote is only linked to the biometrics, so people cannot identify who the votes were cast by. <br>
  Phase 3: POST-ELECTION
          Once the election is over, the result can be calculated instantaneously as the votes are stored in ledger for each constituency and hence saves time. 
