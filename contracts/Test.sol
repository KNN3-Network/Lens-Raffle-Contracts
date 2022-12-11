// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

contract Handle {

function getHandle(string calldata handle) public pure returns(bytes memory) {
        unchecked{ bytes memory byteHandle = bytes(handle);
        return byteHandle;}
    }


// function _validateHandle(string calldata handle) private pure {
//         bytes memory byteHandle = bytes(handle);
//         if (byteHandle.length == 0 || byteHandle.length > Constants.MAX_HANDLE_LENGTH)
//             revert Errors.HandleLengthInvalid();

//         uint256 byteHandleLength = byteHandle.length;
//         for (uint256 i = 0; i < byteHandleLength; ) {
//             if (
//                 (byteHandle[i] < '0' ||
//                     byteHandle[i] > 'z' ||
//                     (byteHandle[i] > '9' && byteHandle[i] < 'a')) &&
//                 byteHandle[i] != '.' &&
//                 byteHandle[i] != '-' &&
//                 byteHandle[i] != '_'
//             ) revert Errors.HandleContainsInvalidCharacters();
//             unchecked {
//                 ++i;
//             }
//         }
//     }

}