/*
 * @lc app=leetcode.cn id=1 lang=javascript
 *
 * [1] 两数之和
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function (nums, target) {
    const numsLen = nums.length;
    for (let i = 0; i < numsLen; i++) {
        for (let j = i + 1; j < numsLen; j++) {
            if (nums[i] + nums[j] === target) {
                return [i, j];
            }
        }
    }
};
// @lc code=end