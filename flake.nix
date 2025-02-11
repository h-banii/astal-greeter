{
  inputs = {
    ags = {
      url = "github:aylur/ags";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs =
    {
      nixpkgs,
      ags,
      ...
    }:
    let
      system = "x86_64-linux";
      pkgs = import nixpkgs { inherit system; };
      astalPackages = ags.inputs.astal.packages.${system};
      extraPackages = with astalPackages; [
        greet
      ];
    in
    {
      devShells.${system}.default = pkgs.mkShell {
        buildInputs = with pkgs; [
          (ags.packages.${system}.default.override {
            inherit extraPackages;
          })
          nodejs
          nodePackages.npm
          gtk4
        ];
        shellHook = ''
          export AGS_DIR=''$PWD
          run() {
            ags run "''${AGS_DIR}/src/app.ts" --gtk4
          }
          format() {
            npx prettier ./src --write
          }
          tmp=`mktemp`
          jq '.dependencies.astal |= "${astalPackages.gjs}/share/astal/gjs"' < package.json > $tmp
          mv $tmp package.json
          npm i --frozen-lockfile
        '';
      };

      packages.${system}.default = ags.lib.bundle {
        inherit pkgs;
        inherit extraPackages;
        src = ./.;
        name = "h-banii.ags-shell";
        entry = "src/app.ts";
        gtk4 = true;
      };
    };
}
