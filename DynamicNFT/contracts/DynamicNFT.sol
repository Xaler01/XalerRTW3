// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

//Deployed to mumbai at 0xEf21FB1c8580489F5BB111A54fE01061137491D4

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract DynamicNFT is ERC721URIStorage {
    using Strings for uint256;
    using Counters for Counters.Counter; 
    uint256 constant MAX_SUPPLY = 20;
    Counters.Counter private _tokenIds;
    
    struct dinamycAttributes {
        uint256 level;  // 0
        uint256 knowledge;  // 1
        uint256 wisdom;  // 2
        uint256 perseverance;  // 3
    }

    mapping(uint256 => dinamycAttributes) public tokenIdToatributes;

    constructor () ERC721 ("Dynamic NFT - By Xaler", "XALRAJ"){

    }

    function generateCharacter(uint256 tokenId) public returns(string memory){

        bytes memory svg = abi.encodePacked(
            '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350">',
            '<style>.base { fill: #FF1616; font-family: serif; font-size: 30px; }</style>',
            '<style>.attrib {fill: #000101; font-family: serif; font-size: 18px; }</style>',
            '<style>.nivel {fill: #FEFEFF; font-family: serif; font-size: 25px; }</style>',
            '<rect width="100%" height="100%" fill="#18BBD2" />',
            '<text x="50%" y="15%" class="base" dominant-baseline="middle" text-anchor="middle"><tspan class="nivel"> #', tokenId.toString(), '</tspan>',"  Your dynamic NFT",'</text>',
            '<text x="15%" y="40%" class="attrib" dominant-baseline="middle" text-anchor="left">',"Knowledge: ",getAttributes(tokenId ,1 ),'</text>',
            '<text x="15%" y="50%" class="attrib" dominant-baseline="middle" text-anchor="left">',"Wisdom: ",getAttributes(tokenId, 2),'</text>',
            '<text x="15%" y="60%" class="attrib" dominant-baseline="middle" text-anchor="left">',"Perseverance: ",getAttributes(tokenId, 3),'</text>',
            '<text x="50%" y="90%" class="nivel" dominant-baseline="middle" text-anchor="middle">',"Level: ",getAttributes(tokenId, 4),'</text>',
            
            '</svg>'
        );
        return string(
            abi.encodePacked(
                "data:image/svg+xml;base64,",
                Base64.encode(svg)
            )    
        );
    }

    function getAttributes(uint256 tokenId, uint8 attribute) public view returns (string memory){

        require(attribute <= 4, "Unknown attribute");
        string memory returnValue;
        dinamycAttributes memory attributes = tokenIdToatributes [tokenId];
        if(attribute == 1){returnValue = attributes.knowledge.toString();}
        else if(attribute == 2){returnValue = attributes.wisdom.toString();}
        else if(attribute == 3){returnValue = attributes.perseverance.toString();}
        else{returnValue = attributes.level.toString();} // ==level

        return returnValue;
    }
    function getTokenURI(uint256 tokenId) public returns (string memory){
        bytes memory dataURI = abi.encodePacked(
            '{',
                '"name": "Xaler - Dynamic NFT #', tokenId.toString(), '",',
                '"description": "Train your "dynamic NFT" and modify your capabilities ",',
                '"image": "', generateCharacter(tokenId), '"',
            '}'
        );
        return string(
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(dataURI)
            )
        );
    } 
    function randomness(uint rng, uint scale) private view returns(uint){
            uint random_keccak = uint(keccak256(abi.encodePacked(block.timestamp, block.difficulty, msg.sender)));
            return (random_keccak % rng) * scale;
    }
      function mint() public{
        //require max minted
        require(_tokenIds.current() <= MAX_SUPPLY, "Maxmimum nft minted, sorry");
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _safeMint(msg.sender, newItemId);
        tokenIdToatributes[newItemId].knowledge = randomness(25,1);
        tokenIdToatributes[newItemId].wisdom = randomness(25,2);
        tokenIdToatributes[newItemId].perseverance = randomness(100,5);
        tokenIdToatributes[newItemId].level = 1;
        _setTokenURI(newItemId, getTokenURI(newItemId));
    }

    function train(uint256 tokenId) public{
        require(_exists(tokenId), "Please use an existing token");
        require(ownerOf(tokenId) == msg.sender, "You must own this NFT to train it!");
        uint256 currentknowledge = tokenIdToatributes[tokenId].knowledge;
        uint256 currentwisdom = tokenIdToatributes[tokenId].wisdom;
        uint256 currentperseverance = tokenIdToatributes[tokenId].perseverance;
        uint256 currentLevel = tokenIdToatributes[tokenId].level;

        tokenIdToatributes[tokenId].level = currentLevel + 1;
        tokenIdToatributes[tokenId].knowledge = currentknowledge - randomness(4,2) + randomness(6,1);
        tokenIdToatributes[tokenId].wisdom = currentwisdom - randomness(3,1) + randomness(6,2);
        tokenIdToatributes[tokenId].perseverance = currentperseverance - randomness(20,4) + randomness(10,2);
        _setTokenURI(tokenId, getTokenURI(tokenId));
    }

}
