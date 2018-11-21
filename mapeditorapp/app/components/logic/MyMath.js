export class MyMath {
	static lerp(num, in_min, in_max, out_min, out_max) {
		let lerped = ((num - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
		if (lerped < out_min || lerped > out_max) {
			return Math.max(Math.min(lerped, out_max), out_min);
		}
		return lerped;
	}
}
