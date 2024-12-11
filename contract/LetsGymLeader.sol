// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Counters} from "@openzeppelin/contracts/utils/Counters.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC4906} from "@openzeppelin/contracts/interfaces/IERC4906.sol";

contract GymBadge is ERC721, Ownable, IERC4906 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    mapping(address => bool) public isGymLeader;
    string[] badgeURIs;
    mapping(uint => uint) metadataIdMap;
    uint currentMetadataId = 0;

    event BadgeIssued(
        address indexed gymLeader,
        address indexed trainer,
        uint256 tokenId
    );

    constructor(string memory _badgeMetadataURI)
        ERC721("gym", "BADGE")
        Ownable(msg.sender)
    {
        addMetadata(_badgeMetadataURI);
    }

    function sendBadge(address _trainer) public {
        require(isGymLeader[msg.sender], "Caller is not a gym leader");
        _tokenIds.increment();
        uint newTokenId = _tokenIds.current();
        metadataIdMap[newTokenId] = currentMetadataId;
        _safeMint(_trainer, newTokenId);
        emit BadgeIssued(msg.sender, _trainer, newTokenId);
    }

    function setCurrentMetadataId (uint _currentMetadataId) public onlyOwner {
        require(_currentMetadataId < badgeURIs.length, "Invalid metadata ID");
        currentMetadataId = _currentMetadataId;
    }

    function addGymLeader(address _newGymLeader) public onlyOwner {
        isGymLeader[_newGymLeader] = true;
    }

    function removeGymLeader(address _gymLeader) public onlyOwner {
        isGymLeader[_gymLeader] = false;
    }

    function renounceOwnership() public virtual override onlyOwner {
        revert("Ownership cannot be renounced");
    }

    function addMetadata(string memory _badgeURI) public onlyOwner {
        badgeURIs.push(_badgeURI);
    }

    function changeMetadata(string memory _badgeURI, uint _badgeNumber) public onlyOwner {
        require(_badgeNumber < badgeURIs.length, "Invalid badge number");
        badgeURIs[_badgeNumber] = _badgeURI;
        emit BatchMetadataUpdate(1, type(uint256).max);
    }

    function checkGymLeader(address _address) public view returns (bool) {
        return isGymLeader[_address];
    }

    function getMetadataList() public view returns (string[] memory) {
        return badgeURIs;
    }

    function tokenURI(uint256 _tokenId) public view override returns (string memory) {
        require(ownerOf(_tokenId) != address(0), "ERC721: URI query for nonexistent token");
        return badgeURIs[metadataIdMap[_tokenId]];
    }
}
