// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

//Deployed to mumbai at 0xDFF7FE6ecd3bDfb04546aa9C54fa2fe089c8354B

contract BuyMeACoffee {
    //Event to emit when a memo is created
    event NewMemo(
        address indexed from,
        uint256 timestamp,
        string name,
        string message
    );

    //Memo Struct.
    struct Memo{
        address from;
        uint256 timestamp;
        string name;
        string message;
    }

    //List of all memos recived from friends
    Memo[] memos;

    //Address of Contract Deployed
    address payable owner;

    //Deploy logic
    constructor(){
        owner = payable(msg.sender);
    }

    /**
    * @dev buy coffe for contract owner
    * @param _name name of the coffee buyer
    * @param _message a nice message from the coffee buyer
     */
     function buyCoffee(string memory _name, string memory _message) public payable {
        require(msg.value > 0, "Can't buy a coffee with 0 ETH" );

        //Adde the memo to storage
        memos.push (Memo (
            msg.sender,
            block.timestamp,
            _name,
            _message
        ));

        //Emit a log event when the memo is created
        emit NewMemo (
            msg.sender,
            block.timestamp,
            _name,
            _message
        );
     }

     /**
    * @dev send the entery balance on the contract to the owner
     */   
    function withDrawTips() public {
        require(owner.send(address(this).balance));
    }

    /**
    * @dev Retrive all the messages recived and stored on blockchain
    */
    function getMemos() public view returns(Memo []memory) {
        return memos;
    }
}
 