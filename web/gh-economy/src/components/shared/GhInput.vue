<template>
  <div class="wrap-input">
    <input
      :value="modelValue"
      @input="updateValue"
      :placeholder="placeholder"
      :type="type"
      :max="max"
    />
  </div>
</template>

<script>
export default {
  name: "GhInput",

  props: {
    modelValue: "",
    placeholder: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "text",
    },
    max: {
      type: String,
      default: "",
    },
    min: {
      type: String,
      default: "",
    },
  },
  methods: {
    updateValue(event) {
      this.$emit("update:modelValue", event.target.value);
    },
  },
};
</script>

<style>
.wrap-input {
  cursor: text;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  border-radius: 12px;
  border: 2px solid rgb(229, 232, 235);
  color: rgb(4, 17, 29);
  width: 100%;
  padding: 12px;
  height: 48px;
  font-size: 16px;
}

.wrap-input input {
  font-size: inherit;
  line-height: inherit;
  min-height: inherit;
  text-overflow: ellipsis;
  cursor: text;
  background-color: transparent;
  border: none;
  outline: none;
  color: inherit;
  font: inherit;
  margin: 0px;
  width: 100%;
}
</style>